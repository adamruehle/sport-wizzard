import styles from './Offer.module.css';

export default function Offer( {title, description, price, period} ) {
  const splitDescription = () => {
    return description.split('-').map((item, index) => <p key={index}>{item}</p>);
  }

  return (
    <div className={styles.offerContainer}>
      <div className={styles.titleContainer}>
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.priceContainer}>
        <span className={styles.price}>{price}</span>
        <span className={styles.period}>{period}</span>
      </div>
      <div className={styles.descriptionContainer}>
        {splitDescription()}
      </div>
    </div>
  );
}