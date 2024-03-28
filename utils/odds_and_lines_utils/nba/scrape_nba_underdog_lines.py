import os
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time
import time
import datetime
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
import csv
from datetime import datetime
import random
import os
import base64
import re
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import undetected_chromedriver as uc
import json
import tempfile
from functools import reduce

class ChromeWithPrefs(webdriver.Chrome):
    def __init__(self, *args, options=None, **kwargs):
        if options:
            self._handle_prefs(options)

        super().__init__(*args, options=options, **kwargs)

        # remove the user_data_dir when quitting
        self.keep_user_data_dir = False

    @staticmethod
    def _handle_prefs(options):
        if prefs := options.experimental_options.get("prefs"):
            # turn a (dotted key, value) into a proper nested dict
            def undot_key(key, value):
                if "." in key:
                    key, rest = key.split(".", 1)
                    value = undot_key(rest, value)
                return {key: value}

            # undot prefs dict keys
            undot_prefs = reduce(
                lambda d1, d2: {**d1, **d2},  # merge dicts
                (undot_key(key, value) for key, value in prefs.items()),
            )

            # create an user_data_dir and add its path to the options
            user_data_dir = os.path.normpath(tempfile.mkdtemp())
            options.add_argument(f"--user-data-dir={user_data_dir}")

            # create the preferences json file in its default directory
            default_dir = os.path.join(user_data_dir, "Default")
            os.mkdir(default_dir)

            prefs_file = os.path.join(default_dir, "Preferences")
            with open(prefs_file, encoding="latin1", mode="w") as f:
                json.dump(undot_prefs, f)

            # pylint: disable=protected-access
            # remove the experimental_options to avoid an error
            del options._experimental_options["prefs"]

def extract_link_from_underdog_email(message):
    payload = message['payload']
    if 'parts' in payload:
        for part in payload['parts']:
            if part['mimeType'] == 'text/html':
                data = part['body']['data']
                decoded_data = base64.urlsafe_b64decode(data).decode('utf-8')
                urls = re.findall(r'href=["\'](.*?)["\']', decoded_data)
                return urls[1] # The second URL is the one we want

def get_underdog_id_verification_link_from_email():
    credentials = None
    if os.path.exists('token.json'):
        credentials = Credentials.from_authorized_user_file("token.json", scopes=["https://www.googleapis.com/auth/gmail.readonly"])
    if not credentials or not credentials.valid:
        if credentials and credentials.expired and credentials.refresh_token:
            credentials.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                "credentials.json", scopes=["https://www.googleapis.com/auth/gmail.readonly"]
            )
            credentials = flow.run_local_server(port=0)
        with open("token.json", "w") as token:
            token.write(credentials.to_json())
    try:
        service = build("gmail", "v1", credentials=credentials)
        results = service.users().messages().list(userId="me", q="from:support@e.underdogfantasy.com").execute()
        messages = results.get("messages", [])
        if not messages:
            print("No messages from underdog found.")
            return
        most_recent_underdog_full_message = service.users().messages().get(userId="me", id=messages[0]["id"]).execute()
        url = extract_link_from_underdog_email(most_recent_underdog_full_message)
        return url
    except HttpError as error:
        print(f"An error occurred: {error}")

def login(driver):
    print("Signing in to underdog...")
    username = "ugageeb@gmail.com"
    password = "jbpojerg772@dfbjpjrgSDG"
    driver.get("https://underdogfantasy.com/pick-em/higher-lower/all/nba")
    driver.maximize_window()
    time.sleep(3)
    email_input = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="email_input"]'))) # .styles__field__Q6LKF [data-testid="email_input"]
    email_input.send_keys(username)
    password_input = driver.find_element(By.CSS_SELECTOR, '[data-testid="password_input"]') # .styles__field__Q6LKF [data-testid="password_input"]
    password_input.send_keys(password)
    form = driver.find_element(By.CSS_SELECTOR, "form.styles__form__jBI8X")
    form.submit()
    # try:
    #     # if user is not signed in, then the email input will still be present
    #     email_input = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="email_input"]'))) # .styles__field__Q6LKF [data-testid="email_input"]
    #     if email_input:
    #         url = get_underdog_id_verification_link_from_email()
    #         driver.get(url)
    #         print("GOT URL???")
    # except:
    #     pass
    # don't go to pick-em webpage until verified that user is signed in
    signed_in_verifier_element = WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.CSS_SELECTOR, 'a.styles__link__C_eQ8.styles__active__UQzgQ')))
    driver.get("https://underdogfantasy.com/pick-em/higher-lower/pre-game/nba")

def write_to_csv(data):
    current_date = datetime.now().strftime("%Y-%m-%d")
    csv_file_path = f'odds-lines-data/underdog-lines/nba/nba_underdog_lines_{current_date}.csv'
    directory = os.path.dirname(csv_file_path)
    if not os.path.exists(directory):
        os.makedirs(directory)
    # Extract all unique property names from data
    all_props = [prop for player_data in data for prop in player_data.keys() if prop != 'Name']
    unique_props = list(set(all_props))
    # Define fieldnames including 'Name' and unique properties
    fieldnames = ['Name'] + unique_props
    with open(csv_file_path, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        if csvfile.tell() == 0:
            writer.writeheader()
        # Write data to CSV file
        for player_data in data:
            # Create dictionary with all properties and their corresponding values
            player_dict = {'Name': player_data['Name']}
            for prop in unique_props:
                player_dict[prop] = player_data.get(prop, '')
            writer.writerow(player_dict)

def find_player_and_props(driver, player_prop_div):
    try:
        more_picks_button = WebDriverWait(player_prop_div, 10).until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "button")))[-1]
        more_picks_span = more_picks_button.find_element(By.CSS_SELECTOR, 'span')
        if "More picks" in more_picks_span.text:
            driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", more_picks_button)
            more_picks_button.click()
    except:
        driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", player_prop_div)
    player_name_element = WebDriverWait(player_prop_div, 10).until(EC.visibility_of_element_located((By.CSS_SELECTOR, 'h1.styles__playerName__jW6mb')))
    player_name = player_name_element.text
    props = []
    stat_line_elements = player_prop_div.find_elements(By.CSS_SELECTOR, 'div.styles__overUnderListCell__tbRod')
    player_data = {'Name': player_name}
    for stat_line_element in stat_line_elements:
        prop = stat_line_element.find_element(By.CSS_SELECTOR, 'p').text
        if "1H" in prop or "1Q" in prop:
            continue
        prop_name, value = prop.split(' ', 1)  # Split by the first space
        player_data[prop_name] = value
        # Check if prop is a scorcher
        option_buttons = stat_line_element.find_elements(By.CSS_SELECTOR, 'button.styles__pickEmButton__OS_iW')
        has_scorcher_button = True
        for button in option_buttons:
            if button.text == "Lower":
                has_scorcher_button = False
                break
        props.append({'prop': prop, 'has_scorcher_button': has_scorcher_button})
    
    return player_name, props

def scrape_nba_lines():
    options = webdriver.ChromeOptions()
    # options.add_argument("--headless")
    options.add_argument("--log-level=3")
    options.add_argument("--disable-logging")
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-extensions')
    options.add_argument("--dns-prefetch-disable")
    options.add_argument("enable-automation")
    options.add_argument('--disable-gpu')
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--geoenable=true")
    options.add_argument("--remote-debugging-pipe")
    prefs = {"credentials_enable_service": False,
        "profile.password_manager_enabled": False,
        "profile.default_content_setting_values.geolocation": 1
    }
    options.add_experimental_option("prefs", prefs)
    driver = ChromeWithPrefs(service=Service(ChromeDriverManager().install()), options=options)
    # chrome_driver_path = ChromeDriverManager().install()
    # service = Service(executable_path=chrome_driver_path)
    # driver = webdriver.Chrome(service=service, options=options)
    login(driver)
    player_prop_divs_containers = WebDriverWait(driver, 10).until(EC.visibility_of_all_elements_located((By.CSS_SELECTOR, "div.styles__content___R51k")))
    player_prop_divs = []

    for player_prop_divs_container in player_prop_divs_containers:
        current_player_prop_divs = player_prop_divs_container.find_elements(By.CSS_SELECTOR, "div.styles__overUnderCell__KgzNn")
        for player_prop_div in current_player_prop_divs:
            player_prop_divs.append(player_prop_div)

    data = []
    for player_prop_div in player_prop_divs:  # Loop through each player's full prop div
        player_name, props = find_player_and_props(driver, player_prop_div=player_prop_div)
        player_data = {'Name': player_name}
        for prop in props[1:]: # Skip the first prop because it's the player's name
            prop_name = prop['prop'].replace(" + ", "").split(" ")[1].strip()
            # Change prop names to match CSV field name
            if "PtsRebsAsts" in prop_name:
                prop_name = f"PointsReboundsAssists"
            if "3-Pointers" in prop_name:
                prop_name = f"Threes"
            prop_name = prop_name + "_Line"
            value = prop['prop'].split(" ")[0].strip()
            has_scorcher_button = prop['has_scorcher_button']
            if has_scorcher_button:
                value = value + "s"
            player_data[prop_name] = value
        data.append(player_data)
    write_to_csv(data)
    driver.quit()

if __name__ == "__main__":
    scrape_nba_lines()
    print("Success")