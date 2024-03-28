from flask import Flask, jsonify ,render_template, request
from waitress import serve
from utils.find_matches import find_matches_nba, find_matches_nhl, find_matches_mlb
import utils.odds_and_lines_utils.get_betonline_odds as get_betonline_odds
from utils.odds_and_lines_utils.nba.scrape_nba_underdog_lines import scrape_nba_lines
from utils.odds_and_lines_utils.nhl.scrape_nhl_underdog_lines import scrape_nhl_lines
from utils.odds_and_lines_utils.mlb.scrape_mlb_underdog_lines import scrape_mlb_lines
from utils.expected_value import calculate_expected_value
import threading

app = Flask(__name__)

def run_all_get_betonline_odds_functions():
    threads = []
    threads.append(threading.Thread(target=get_nba_betonline_odds))
    threads.append(threading.Thread(target=get_nhl_betonline_odds))
    # threads.append(threading.Thread(target=get_mlb_betonline_odds))
    
    for thread in threads:
        thread.start()
    
    for thread in threads:
        thread.join()

def run_all_scrapers():
    threads = []
    threads.append(threading.Thread(target=scrape_nba_lines))
    threads.append(threading.Thread(target=scrape_nhl_lines))
    # threads.append(threading.Thread(target=scrape_mlb_lines))

    for thread in threads:
        thread.start()
    
    for thread in threads:
        thread.join()


@app.route('/')
def sports():
    return render_template('sports.html')

@app.route('/nba')
def nba():
    return render_template('nba.html')

@app.route('/nhl')
def nhl():
    return render_template('nhl.html')

@app.route('/mlb')
def mlb():
    return render_template('mlb.html')

@app.route('/get_all_data', methods=['POST'])
def get_all_data():
    run_all_get_betonline_odds_functions()
    run_all_scrapers()
    data = []
    try:
        data += find_matches_nba()
    except:
        pass
    try:
        data += find_matches_nhl()
    except:
        pass
    # try:
    #     data += find_matches_mlb()
    # except:
    #     pass
    if data == []:
        data = {"error": "No games found"}
    matching_lines = sorted(data, key=lambda k: k['odds'])
    matching_lines = [line for line in matching_lines if line['odds'] <= -120]
    return jsonify(matching_lines)

@app.route('/get_nba_data', methods=['POST'])
def get_data():
    # handle case where there are no more games today
    try:
        get_nba_betonline_odds()
        scrape_nba_lines()
        data = find_matches_nba()
    except:
        data = {"error": "No games found"}
    return jsonify(data)

@app.route('/get_nhl_data', methods=['POST'])
def get_nhl_data():
    try:
        get_nhl_betonline_odds()
        scrape_nhl_lines()
        data = find_matches_nhl()
    except:
        data = {"error": "No games found"}
    return jsonify(data)

@app.route('/get_mlb_data', methods=['POST'])
def get_mlb_data():
    try:
        get_mlb_betonline_odds()
        scrape_mlb_lines()
        data = find_matches_mlb()
    except:
        data = {"error": "No games found"}
    return jsonify(data)

@app.route('/get_all_betonline_odds', methods=['POST'])
def get_all_betonline_odds():
    try:
        # run at the same time
        def run_all_get_betonline_odds_functions():
            threads = []
            threads.append(threading.Thread(target=get_nba_betonline_odds))
            threads.append(threading.Thread(target=get_nhl_betonline_odds))
            threads.append(threading.Thread(target=get_mlb_betonline_odds))
            
            for thread in threads:
                thread.start()
            
            for thread in threads:
                thread.join()
        run_all_get_betonline_odds_functions()
    except:
        return "Failed: no games found"
    return "Success"

@app.route('/get_nba_betonline_odds', methods=['POST'])
def get_nba_betonline_odds():
    try:
        get_betonline_odds.get_nba_betonline_odds()
    except:
        return "Failed: no games found"
    return "Success"

@app.route('/get_nhl_betonline_odds', methods=['POST'])
def get_nhl_betonline_odds():
    try:
        get_betonline_odds.get_nhl_betonline_odds()
    except:
        return "Failed: no games found"
    return "Success"

@app.route('/get_mlb_betonline_odds', methods=['POST'])
def get_mlb_betonline_odds():
    try:
        get_betonline_odds.get_mlb_betonline_odds()
    except:
        return "Failed: no games found"
    return "Success"

@app.route('/get_all_underdog_lines', methods=['POST'])
def get_all_underdog_odds():
    # run at the same time
    
    run_all_scrapers()
    return "Success"

@app.route('/get_nba_underdog_lines', methods=['POST'])
def get_nba_underdog_odds():
    scrape_nba_lines()
    return "Success"

@app.route('/get_nhl_underdog_lines', methods=['POST'])
def get_nhl_underdog_odds():
    scrape_nhl_lines()
    return "Success"

@app.route('/get_mlb_underdog_lines', methods=['POST'])
def get_mlb_underdog_odds():
    scrape_mlb_lines()
    return "Success"

@app.route('/display_all_odds_and_picks', methods=['POST'])
def display_all_underdog_lines():
    data = []
    try:
        data += find_matches_nba()
    except:
        pass
    try:
        data += find_matches_nhl()
    except:
        pass
    # try:
    #     data += find_matches_mlb()
    # except:
    #     pass
    if data == []:
        data = {"error": "No games found"}
    print(data)
    matching_lines = sorted(data, key=lambda k: k['odds'])
    matching_lines = [line for line in matching_lines if line['odds'] <= -120]
    return jsonify(matching_lines)

@app.route('/display_nba_odds_and_picks', methods=['POST'])
def display_nba_odds_and_picks():
    data = find_matches_nba()
    return jsonify(data)

@app.route('/display_nhl_odds_and_picks', methods=['POST'])
def display_nhl_odds_and_picks():
    data = find_matches_nhl()
    return jsonify(data)

@app.route('/display_mlb_odds_and_picks', methods=['POST'])
def display_mlb_odds_and_picks():
    data = find_matches_mlb()
    return jsonify(data)

@app.route('/calculate_expected_value', methods=['POST'])
def calculate_expected_value():
    data = request.get_json()
    number_of_props_to_payout_mapping = {"2": 3, "3": 6, "4": 10, "5": 20}
    probabilities = data['probabilities']
    multipliers = data['multipliers']
    bet_amount = data['betAmount']
    # EV = P(win) x Payout - P(loss) x Bet
    # Calculate the product of probabilities (P(win))
    prob_win_combined = 1
    for prob in probabilities:
        prob = prob / 100
        prob_win_combined *= prob
    # (P(loss))
    prob_lose = 1 - prob_win_combined
    # Calculate the product of multipliers (Payout)
    payout_multiplier = number_of_props_to_payout_mapping[str(len(multipliers))]
    for multiplier in multipliers:
        payout_multiplier *= multiplier
    # Calculate and return the expected value
    ev = prob_win_combined * payout_multiplier * bet_amount - prob_lose * bet_amount
    # print(ev)
    return jsonify({"expectedValue": ev, "payoutMultiplier": payout_multiplier, "probWinCombined": prob_win_combined})

if __name__ == '__main__':
    app.run(debug=True) # for testing
    # serve(app, host='127.0.0.1', port=5000)
    # serve(app, host='0.0.0.0', port=8080)