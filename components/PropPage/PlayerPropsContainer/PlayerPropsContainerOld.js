  import React, { useState, useEffect } from 'react';
  import styles from './PlayerPropsContainer.module.css';
  import PlayerProp from '@/components/PropPage/PlayerProp/PlayerProp';

  const PlayerPropsContainer = ({ leagues, books, fantasyApps, properties }) => {
    const [playerProps, setPlayerProps] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const values = JSON.stringify({ leagues, books, fantasyApps, properties });
    // console.log(leagues, books, fantasyApps, properties);
    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true); // Set loading state to true
        setError(null); // Clear any previous errors

        try {
          // Call read current matches API after successful save
          const readResponse = await fetch('/api/lines/retrieve-current-matches', {
            method: 'POST', // Assuming read API also uses POST
            headers: { 'Content-Type': 'application/json' },
            body: values,
          });

          if (!readResponse.ok) {
            throw new Error('Error reading current matches');
          }

          const data = await readResponse.json();
          setPlayerProps(data);
        } catch (error) {
          console.error('Error fetching data:', error);
          setError('An error occurred while fetching data');
        } finally {
          setIsLoading(false); // Set loading state to false after fetching
        }
      };
      fetchData();
    }, [leagues, books, fantasyApps, properties]);

    return (
      <div className={styles.propsContainer}>
        {playerProps.map((playerProp, index) => (
          <PlayerProp
            key={index}
            playerName={playerProp.player}
            league={playerProp.league}
            prop={playerProp.prop}
            line={playerProp.line}
            odds={playerProp.odds}
            type={playerProp.type}
            impliedProbability={playerProp.impliedProbability}
            book={playerProp.book}
            fantasyApp={playerProp.fantasyApp}
          />
        ))}
      </div>
    );
  };

  export default PlayerPropsContainer;