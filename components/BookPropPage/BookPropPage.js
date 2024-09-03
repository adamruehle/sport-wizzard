import React, { useState, useEffect } from 'react';
import styles from './BookPropPage.module.css';
import Header from '@/components/Header/Header';
import MatchupsContainer from '@/components/MatchupsContainer/MatchupsContainer';
import PlayerPropsContainer from '@/components/BookPropPage/PlayerPropsContainer/PlayerPropsContainer';

export default function PropPage({ league }) {
  const [matchups, setMatchups] = useState([]);
  const [playerProps, setPlayerProps] = useState([]);

  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await fetch(`/api/games/getGamesToday?league=${league}`);
        if (!response.ok) {
          console.error('Failed to fetch games');
          return;
        }
        const data = await response.json();
        setMatchups(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchGames();
  }, [league]);

  useEffect(() => {
    async function fetchPlayerProps() {
      try {
        const response = await fetch(`/api/props/getPlayerProps?league=${league}`);
        if (!response.ok) {
          console.error('Failed to fetch player props');
          return;
        }
        const data = await response.json();
        setPlayerProps(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchPlayerProps();
  }, [league]);

  {/* Example matchups */}
  // const matchups = [
  //   {league: 'nba', team1: 'OKC', team1Record: "57-25", team2: "DAL", team2Record: "50-32", time: "Today 8:00pm"},
  //   {league: 'mlb' , team1: 'NYY', team1Record: "100-62", team2: "BOS", team2Record: "90-72", time: "Today 7:00pm"},
  //   {league: 'mlb', team1: 'LAD', team1Record: "105-57", team2: "SF", team2Record: "95-67", time: "Today 10:00pm"},
  //   {league: 'mlb', team1: 'HOU', team1Record: "98-64", team2: "SEA", team2Record: "88-74", time: "Today 9:00pm"},
  //   {league: 'mlb', team1: 'CHC', team1Record: "92-70", team2: "STL", team2Record: "82-80", time: "Today 8:00pm"},
  //   {league: 'mlb', team1: 'ATL', team1Record: "95-67", team2: "NYM", team2Record: "85-77", time: "Today 7:00pm"},
  //   {league: 'mlb', team1: 'LAA', team1Record: "88-74", team2: "OAK", team2Record: "78-84", time: "Today 10:00pm"},
  //   {league: 'mlb', team1: 'TOR', team1Record: "85-77", team2: "TB", team2Record: "75-87", time: "Today 9:00pm"},
  // ];
  // const playerProps = [
  //   {player: 'Shohei Ohtani', matchup: 'LAA vs OAK', team: 'LAA', position: 'P', time: '10:00pm', prop: 'strikeouts', line: '6.5', odds: '-110', impliedProbability: '52.38%', book: 'Betonline', fantasyApp: 'Prizepicks'},
  //   {player: 'Mike Trout', matchup: 'LAA vs OAK', team: 'LAA', position: 'CF', time: '10:00pm', prop: 'hits', line: '2.5', odds: '-110', impliedProbability: '52.38%', book: 'Betonline', fantasyApp: 'Prizepicks'},
  //   {player: 'Mookie Betts', matchup: 'LAD vs SF', team: 'LAD', position: 'RF', time: '10:00pm', prop: 'runs', line: '1.5', odds: '-110', impliedProbability: '52.38%', book: 'Betonline', fantasyApp: 'Prizepicks'},
  //   {player: 'Fernando Tatis Jr.', matchup: 'SD vs COL', team: 'SD', position: 'SS', time: '9:00pm', prop: 'home runs', line: '0.5', odds: '-110', impliedProbability: '52.38%', book: 'Betonline', fantasyApp: 'Prizepicks'},
  //   {player: 'Ronald Acuna Jr.', matchup: 'ATL vs NYM', team: 'ATL', position: 'CF', time: '7:00pm', prop: 'total bases', line: '2.5', odds: '-110', impliedProbability: '52.38%', book: 'Betonline', fantasyApp: 'Prizepicks'},
  //   {player: 'Jacob deGrom', matchup: 'NYM vs ATL', team: 'NYM', position: 'P', time: '7:00pm', prop: 'strikeouts', line: '10.5', odds: '-110', impliedProbability: '52.38%', book: 'Betonline', fantasyApp: 'Prizepicks'},
  //   {player: 'Aaron Judge', matchup: 'NYY vs BOS', team: 'NYY', position: 'RF', time: '7:00pm', prop: 'hits', line: '2.5', odds: '-110', impliedProbability: '52.38%', book: 'Betonline', fantasyApp: 'Prizepicks'},
  // ]

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });

  const noData = matchups.length === 0 && playerProps.length === 0;

  return (
    <main>
      <Header />

      <div className={`flex flex-col ${styles.bookPageContainer}`}>
        {noData ? (
          <div className="flex flex-col items-center justify-center h-full">
            <h2>No games or player props available today</h2>
            <p>Check back later for updated matchups and player props.</p>
          </div>
        ) : (
          <>
            <PlayerPropsContainer playerProps={playerProps} />
            <MatchupsContainer matchups={matchups} />
          </>
        )}
      </div>
    </main>
  );
}