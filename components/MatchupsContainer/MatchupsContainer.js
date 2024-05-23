import { useRef } from 'react';
import styles from './MatchupsContainer.module.css';
import Matchup from './Matchup/Matchup';
import { Button } from "reactstrap";

export default function MatchupsContainer({ matchups }) {
  const containerRef = useRef();

  const scrollLeft = () => {
    containerRef.current.scrollBy({ left: -100, behavior: 'smooth' });
  }

  const scrollRight = () => {
    containerRef.current.scrollBy({ left: 100, behavior: 'smooth' });
  }

  return (
    <div className={styles.container}>
      <Button className={styles.arrow} onClick={scrollLeft}>{"<"}</Button>
      <div ref={containerRef} className={styles.matchupsContainer}>
        {matchups.map((matchup, index) => (
          <Matchup className={styles.matchup} key={index} matchup={matchup} />
        ))}
      </div>
      <Button className={styles.arrow} onClick={scrollRight}>{">"}</Button>
    </div>
  )
}