
import styles from './BookPlayerProp.module.css';
import Image from 'next/image';

// playerProp usage: player, matchup, team, position, time, prop, line, odds, impliedProbability, book, fantasyApp
export default function PlayerProp({ playerProp }) {
  const {player, league, team, date, time, homeTeam, awayTeam, prop, line, odds, type, impliedProbability, book, fantasyApp} = playerProp;
  return (
    <div className={`${styles.propContainer} items-center`}>
      <div className={`${styles.nameContainer} flex items-center`}>
        <Image src="/images/players/nba/JalenWilliams.webp" alt="player" width={80} height={80} />
        <div className='flex flex-col'>
        <div className={`${styles.player} font-bold text-md sm:text-2xl`}>{player}</div>
        {odds < -138 ? <Image src="/fire-gif.gif"  unoptimized layout="intrinsic" width={40} height={40} className="text-2xl mx-2"/> : <div></div> }
        </div>
      </div>
      <div className={`font-normal ${styles.metaDataContainer}`}>
        <div className={styles.bottomAlign}>
          <div >{prop}</div>
          <div>{type} {line}</div>
          
        </div>
        <div className={styles.bottomAlign} >
          <div >{odds}</div>
          <div >{impliedProbability}</div>
        </div>
        <div className={styles.bottomAlign}>
          <div>{book}</div>
          <div>{fantasyApp}</div>
        </div>
      </div>
    </div>
  );
}