import requests
import json
import csv
from datetime import datetime
import pytz

class APIException(Exception):
    pass

class NoGamesFound(APIException):
    pass

class RequestQuotaReached(APIException):
    pass

def get_player_props_for_event(api_key, event_id, sport, desired_markets, bookmaker_key):
    regions = "us"
    odds_format = "american"
    # Format markets to be used in the API request
    markets_str = ",".join(desired_markets)
    # Create the URL for the API request
    url = f"https://api.the-odds-api.com/v4/sports/{sport}/events/{event_id}/odds?apiKey={api_key}&regions={regions}&markets={markets_str}&oddsFormat={odds_format}&bookmakers={bookmaker_key}"
    print(url)
    # Get the response from the Odds API
    response = requests.get(url)
    # Check if the request was successful
    if response.status_code == 401:
        print("Request quota has been reached for", api_key)
        raise RequestQuotaReached("Request quota reached for the API key")
    # Get the JSON data from the response
    player_props_data = response.json()
    # Check if the response contains the required data
    if not player_props_data.get('bookmakers'):
        return True, "No bookmakers data found in the response", None
    
    # Create a dictionary to store the player props data
    player_odds_dict = {}
    try:
        market_types = []
        for market in player_props_data['bookmakers'][0]['markets']:
            market_key = market['key']
            market_type = market_key.split('_')[1].capitalize()
            if "total_saves" in market_key:
                market_type = "Saves"
            if "points_rebounds_assists" in market_key:
                market_type = "PointsReboundsAssists"
            if "pitcher_strikeouts" in market_key:
                market_type = "PitcherStrikeouts"
            if "pitcher_hits_allowed" in market_key:
                market_type = "HitsAllowed"
            if "pitcher_earned_runs" in market_key:
                market_type = "EarnedRunsAllowed"
            if "batter_total_bases" in market_key:
                market_type = "Bases"
            if "batter_rbis" in market_key:
                market_type = "RBIs"
            if "batter_hits_runs_rbis" in market_key:
                market_type = "HitsRunsRBIs"
            if "batter_stolen_bases" in market_key:
                market_type = "StolenBases"
            if "batter_strikeouts" in market_key:
                market_type = "BatterStrikeouts"
            market_types.append(market_type)
        for market in player_props_data['bookmakers'][0]['markets']:
            market_key = market['key']
            market_type = market_key.split('_')[1].capitalize()  # Assuming the format is always "player_{type}"
            if "total_saves" in market_key:
                market_type = "Saves"
            if "points_rebounds_assists" in market_key:
                market_type = "PointsReboundsAssists"
            if "pitcher_strikeouts" in market_key:
                market_type = "PitcherStrikeouts"
            if "pitcher_hits_allowed" in market_key:
                market_type = "HitsAllowed"
            if "pitcher_earned_runs" in market_key:
                market_type = "EarnedRunsAllowed"
            if "batter_total_bases" in market_key:
                market_type = "Bases"
            if "batter_rbis" in market_key:
                market_type = "RBIs"
            if "batter_hits_runs_rbis" in market_key:
                market_type = "HitsRunsRBIs"
            if "batter_stolen_bases" in market_key:
                market_type = "StolenBases"
            if "batter_strikeouts" in market_key:
                market_type = "BatterStrikeouts"
            for outcome in market['outcomes']:
                # Extract relevant data
                player_name = outcome['description']
                over_odds = outcome['price'] if outcome['name'] == 'Over' else None
                under_odds = outcome['price'] if outcome['name'] == 'Under' else None
                line_value = outcome.get('point')
                # If player is not in the dictionary yet, initialize with None values for all markets
                if player_name not in player_odds_dict:
                    player_odds_dict[player_name] = {market_type: {"Over": None, "Under": None, "Line": None} for market_type in market_types}
                # Update the dictionary for player[market type] with the extracted data
                player_odds_dict[player_name][market_type] = {
                    "Over": over_odds,
                    "Under": under_odds,
                    "Line": line_value
                }
    except Exception as e:
        print(e)
        return False, None, None # Return None if there is an error other than the request quota being reached
    return True, player_odds_dict, market_types

def fetch_props_for_all_events(api_key, sport, desired_markets, bookmaker_key):
    full_player_odds_dict = {}
    sport_abbreviation = sport.split("_")[1]
    current_date = datetime.now().strftime("%Y-%m-%d")
    input_file_path = f"odds-lines-data/events/{sport_abbreviation}/{sport_abbreviation}_games_{current_date}.json"
    output_file_path = f"odds-lines-data/betonline/{sport_abbreviation}/{sport_abbreviation}_betonline_odds_{current_date}.csv"
    with open(input_file_path, "r") as json_file:
        games_info = json.load(json_file)
    
    for idx, game_info in games_info.items():
        event_id = game_info.get("event_id")
        if event_id:
            try:
                player_props_success, player_props, market_types = get_player_props_for_event(api_key, event_id, sport, desired_markets, bookmaker_key)
            except RequestQuotaReached as e:
                raise e
            print(market_types)
            if player_props_success == False:
                return False
            if player_props == "No bookmakers data found in the response":
                continue
            
            for player_name, prop_data in player_props.items():
                if player_name not in full_player_odds_dict:
                    full_player_odds_dict[player_name] = prop_data
                else:
                    full_player_odds_dict[player_name].update(prop_data)
            
    with open(output_file_path, "w", newline='', encoding='utf-8') as csv_file:
        fieldnames = ["Player"]
        for market_type in market_types:
            for over_under in ["Over", "Under", "Line"]:
                column_name = f"{market_type}_{over_under}"
                fieldnames.append(column_name)
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
        
        # Write headers
        writer.writeheader()

        # Write data rows
        for player_name, prop_data in full_player_odds_dict.items():
            row_data = {"Player": player_name}
            for prop_type, odds_data in prop_data.items():
                for over_under in ["Over", "Under", "Line"]:
                    column_name = f"{prop_type }_{over_under}" 
                    row_data[column_name] = odds_data[over_under]
            writer.writerow(row_data)
    return True

def get_events(api_key, sport):
    games = {}
    base_url = "https://api.the-odds-api.com/v4"
    regions = "us"
    url = f"{base_url}/sports/{sport}/odds/?apiKey={api_key}&regions={regions}"
    print(url)
    response = requests.get(url)
    if response.status_code == 401: # this api key is out of uses
        print("Request quota has been reached for", api_key)
        raise RequestQuotaReached("Request quota reached for the API key")
    events_data = response.json()
    eastern_timezone = pytz.timezone("US/Eastern")
    try:
        for idx, event in enumerate(events_data):
            event_id = event.get("id")
            commence_time_str = event.get("commence_time")
            teams = (event.get("home_team"), event.get("away_team"))

            if event_id and commence_time_str and teams:
                commence_datetime = datetime.fromisoformat(commence_time_str.replace("Z", "+00:00"))
                commence_datetime_et = commence_datetime.astimezone(eastern_timezone)
                current_datetime_et = datetime.now(eastern_timezone)
                nine_pm_today = datetime.now(eastern_timezone).replace(hour=21, minute=0, second=0, microsecond=0)
                if (current_datetime_et > nine_pm_today) or (commence_datetime_et.time() > current_datetime_et.time() and commence_datetime_et.date() == current_datetime_et.date()):
                    formatted_date = commence_datetime_et.strftime("%Y-%m-%d")
                    formatted_time = commence_datetime_et.strftime("%H:%M:%S")

                    games[idx] = {
                        "event_id": event_id,
                        "date": formatted_date,
                        "time": formatted_time,
                        "teams": teams
                    }

        current_date = datetime.now().strftime("%Y-%m-%d")
        sport = sport.split("_")[1]
        with open(f"odds-lines-data/events/{sport}/{sport}_games_{current_date}.json", "w") as json_file:
            json.dump(games, json_file, indent=2)
        if games != {}:
            return True
        # throw exception if no games are found
        raise NoGamesFound("No games found")
    except Exception as e:
        if str(e) == "Request quota reached for the API key":
            raise RequestQuotaReached("Request quota reached for the API key")

def get_events_props_lines(api_key, sport, desired_markets, bookmaker_key):
    try:
        fetch_events_success = get_events(api_key, sport)
    except Exception as e:
        raise e
    if fetch_events_success:
        print("Events retrieved...")
    if not fetch_events_success:
        return False
    success = fetch_props_for_all_events(api_key, sport, desired_markets, bookmaker_key)
    if success:
        print("Props and lines retrieved...")
        return
    return False

betonline_bookmaker_key = "betonlineag"
caesars_bookmaker_key = "williamhill_us"

def fetch_nba_odds_and_lines(api_key):
    sport_nba = "basketball_nba"
    desired_markets_nba = [
    "player_points", "player_rebounds", "player_points_rebounds_assists",
    "player_assists", "player_threes"
    ]
    try:
        get_events_props_lines(api_key, sport_nba, desired_markets_nba, betonline_bookmaker_key)
    except Exception as e:
        raise e

def fetch_nhl_odds_and_lines(api_key):
    sport_nhl = "icehockey_nhl"
    desired_markets_nhl = [
    "player_points", "player_assists", "player_shots_on_goal", "player_goal_scorer_anytime", "player_total_saves"
    ]
    try:
        get_events_props_lines(api_key, sport_nhl, desired_markets_nhl, betonline_bookmaker_key)
    except Exception as e:
        print(str(e))
        raise e

def fetch_mlb_odds_and_lines(api_key):
    sport_mlb = "baseball_mlb"
    desired_markets_mlb = [
        "pitcher_strikeouts", "pitcher_hits_allowed", "pitcher_earned_runs", "batter_total_bases", "batter_hits",
        "batter_runs_scored", "batter_rbis", "batter_hits_runs_rbis", "batter_singles", "batter_doubles",
        "batter_stolen_bases", "batter_walks", "batter_strikeouts"
    ]
    try:
        get_events_props_lines(api_key, sport_mlb, desired_markets_mlb, betonline_bookmaker_key)
    except Exception as e:
        raise e