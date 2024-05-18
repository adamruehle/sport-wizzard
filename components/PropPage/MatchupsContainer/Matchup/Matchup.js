
import styles from './Matchup.module.css';
import Image from 'next/image';


// Example matchup: {league: 'league', team1: 'Team1', team1Record: 'Team1Record', team2: 'Team2', team2Record: 'Team2Record', time: 'Time'}
export default function MatchupsContainer({ matchup }) {
  return (
    <div className={styles.matchupContainer}>
      <div className={styles.matchup}>
        <Image className={styles.teamImage} src={`/images/teams/${matchup.league}/${matchup.team1}.webp`} alt="Team1" width={70} height={70} />
        <div className={styles.team}>
          {matchup.team1}
        </div>
        <div className={styles.teamRecord}>
          {matchup.team1Record}
        </div>
      </div>
      <div className={styles.matchup}>
        <Image className={styles.teamImage} src={`/images/teams/${matchup.league}/${matchup.team2}.webp`} alt="Team2" width={70} height={70} />
        <div className={styles.team}>
          {matchup.team2}
        </div>
        <div className={styles.teamRecord}>
          {matchup.team2Record}
        </div>
      </div>
      <div className={styles.matchupTime}>
        {matchup.time}
      </div>
    </div>
  )
}