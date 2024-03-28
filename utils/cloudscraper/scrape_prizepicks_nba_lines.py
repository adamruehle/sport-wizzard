import cloudscraper

scraper = cloudscraper.create_scraper()
scraper.get("https://app.prizepicks.com")
print(scraper.get("https://app.prizepicks.com").text)