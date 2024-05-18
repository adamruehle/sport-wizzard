
import styles from './PlayerProp.module.css';
import Image from 'next/image';

// playerProp usage: player, matchup, team, position, time, prop, line, odds, impliedProbability, book, fantasyApp
export default function PlayerProp({ playerProp }) {
  const {player, matchup, team, position, time, prop, line, odds, impliedProbability, book, fantasyApp} = playerProp;
  return (
    <div className={styles.propContainer}>
      <div className={styles.playerPictureAndDescriptionContainer}>
        <Image src="/images/players/nba/JalenWilliams.webp" alt="player" width={80} height={80} />
        <div className={styles.playerAndGameDescription}>
          <div className={styles.matchup}>{matchup}</div>
          <div className={styles.player}>{player}</div>
          <div className={styles.playerTeamAndPositionContainer}>
            <div className={styles.team}>{team}</div>
            <span className={styles.position}> - {position}</span>
          </div>
          <div className={styles.time}>{time}</div>
        </div>
      </div>
      <div className={styles.prop}>
        <div className={styles.prop}>{prop}</div>
        <div className={styles.line}>{line}</div>
      </div>
      <div className={styles.odds}>
        <div className={styles.odds}>{odds}</div>
        <div className={styles.impliedProbability}>{impliedProbability}</div>
      </div>
      <div className={styles.pick}>
        <div className={styles.book}>{book}</div>
        <div className={styles.fantasyApp}>{fantasyApp}</div>
      </div>
    </div>
  );
}