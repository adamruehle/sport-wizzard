import styles from './Offer.module.css';

export default function Offer( {title, description, price, period} ) {
  const splitDescription = () => {
    return description.split('-').map((item, index) => <p key={index}>~{item}</p>);
  }

  return (
    <div className={styles.offerContainer}>
      <div className="text-lg font-semibold sm:text-3xl">{title}</div>
    
      <div className="text-center text-lg">{price}</div>
   
      <div className={styles.descriptionContainer}>
        {splitDescription()}
      </div>
    </div>
  );
}