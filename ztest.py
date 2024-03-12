from utils.find_matches import find_matches_nba, find_matches_nhl

print("Testing...")
nba_matches = find_matches_nba()
for match in nba_matches:
    print(match.get("name"), match.get("proptype"), match.get("line"), match.get("odds"))