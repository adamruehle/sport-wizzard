
import styles from './PlayerPropsContainer.module.css';
import BookPlayerProp from './BookPlayerProp/BookPlayerProp';

export default function PlayerPropsContainer({ playerProps }) {
  return (
    <div className={`mx-5  ${styles.PlayerPropsContainer}`}>
      <div className='text-2xl sm:text-4xl '>Most Recent Picks 🔮</div>
      <div className={` grid my-3 text-xs lg:text-base ${styles.headerGrid}`}>
        <div>Player</div>
        <div className={`grid grid-cols-3`}>
        <div className={`${styles.headerItem}`}>Prop</div>
        <div className={`${styles.headerItem}`}>Probability</div>
        <div className={`${styles.headerItem}`}>Data Sources</div>
        </div>
      </div>
      {playerProps.flatMap((playerProp, index, arr) => [
        <BookPlayerProp key={index} playerProp={playerProp} />,
        index < arr.length - 1 ? <div key={index + 'divider'} style={{ height: '15px', width: '100%' }} /> : null
      ])}
    </div>
  );
}