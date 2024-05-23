
import styles from './PlayerPropsContainer.module.css';
import BookPlayerProp from './BookPlayerProp/BookPlayerProp';

export default function PlayerPropsContainer({ playerProps }) {
  return (
    <div className={styles.PlayerPropsContainer}>
      {playerProps.flatMap((playerProp, index, arr) => [
        <BookPlayerProp key={index} playerProp={playerProp} />,
        index < arr.length - 1 ? <div key={index + 'divider'} style={{ height: '15px', width: '100%' }} /> : null
      ])}
    </div>
  );
}