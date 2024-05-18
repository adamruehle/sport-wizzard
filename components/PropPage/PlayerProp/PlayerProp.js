import React from 'react';
import styles from './PlayerProp.module.css';

const PlayerProp = ({ playerName, league, prop, line, odds, type, impliedProbability, book, fantasyApp }) => {
  return (
    <div className={styles.propContainer}>
      <div className={styles.playerInfo}>
        <h1>{playerName}</h1>
        <h3>{fantasyApp}</h3>
        <p className={styles.leagueInfo}>{league}</p>
      </div>
      <div className={styles.propDetails}>
        <h2>{prop}</h2>
        <div className={styles.details}>
          <p><strong>Line:</strong> {line}</p>
          <p><strong>Type:</strong> {type}</p>
          <p><strong>Odds:</strong> {odds}</p>
          <p><strong>Implied Probability:</strong> {impliedProbability}%</p>
          <p><strong>Book:</strong> {book}</p>
        </div>
      </div>
    </div>
  );
}

export default PlayerProp;