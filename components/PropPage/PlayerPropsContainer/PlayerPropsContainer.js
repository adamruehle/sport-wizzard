
import styles from './PlayerPropsContainer.module.css';
import PlayerProp from './PlayerProp/PlayerProp';

export default function PlayerPropsContainer({ playerProps }) {
  return (
    <div className={styles.PlayerPropsContainer}>
      {playerProps.map((playerProp, index) => (
        <PlayerProp key={index} playerProp={playerProp} />
      ))}
    </div>
  );
}