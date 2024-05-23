
import styles from './Matchup.module.css';
import Image from 'next/image';


// Example matchup: {league: 'league', team1: 'Team1', team1Record: 'Team1Record', team2: 'Team2', team2Record: 'Team2Record', time: 'Time'}
export default function MatchupsContainer({ matchup }) {
  return (
    <div className={styles.matchupContainer}>
      <div className={styles.matchup}>
        <Image className={styles.teamImage} src={`/images/teams/${matchup.league}/${matchup.awayTeam}.webp`} alt="awayTeam" width={70} height={70} />
        <div className={styles.team}>
          {matchup.awayTeam}
        </div>
        <div className={styles.teamRecord}>
          {matchup.awayTeamRecord}
        </div>
      </div>
      <div className={styles.matchup}>
        <Image className={styles.teamImage} src={`/images/teams/${matchup.league}/${matchup.homeTeam}.webp`} alt="homeTeam" width={70} height={70} />
        <div className={styles.team}>
          {matchup.homeTeam}
        </div>
        <div className={styles.teamRecord}>
          {matchup.homeTeamRecord}
        </div>
      </div>
      <div className={styles.matchupTime}>
        {matchup.time}
      </div>
      <div className={styles.odds}>
        {matchup.oddsLine}
      </div>
    </div>
  )
}