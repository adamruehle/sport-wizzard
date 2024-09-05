
import styles from './Matchup.module.css';
import Image from 'next/image';


// Example matchup: {league: 'league', team1: 'Team1', team1Record: 'Team1Record', team2: 'Team2', team2Record: 'Team2Record', time: 'Time'}
export default function MatchupsContainer({ matchup }) {
  return (
    <div className={`flex-grow ${styles.matchupContainer}`}>
      <div className='flex font-bold justify-between items-center'>
        <div className="">
          <Image className={styles.teamImage} src={`/images/teams/${matchup.league}/${matchup.awayTeam}.webp`} alt="awayTeam" width={50} height={50} />
          <div className='text-lg'>{matchup.awayTeam}</div>
        </div>
        <pre className='inline font-bold text-3xl'> @ </pre>
        <div className={styles.matchup}>
          <Image className={styles.teamImage} src={`/images/teams/${matchup.league}/${matchup.homeTeam}.webp`} alt="homeTeam" width={50} height={50} />
          <div className='text-lg'>{matchup.homeTeam}</div>
        </div>
      </div>
      <div className='flex justify-between'>
        <div className={`${styles.matchupTime} text-md font-bold`}>
          {matchup.time}
        </div>
        <div className={`${styles.odds} text-md font-bold`}>
          {matchup.oddsLine}
        </div>
      </div>
    </div>
  )
}