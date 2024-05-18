import React from 'react';
import styles from './InfoCard.module.css';

const InfoCard = ({ title, description }) => {
  return (
    <div className={styles.infoCard}>
      <h2 className={styles.cardTitle}>{title}</h2>
      <p className={styles.cardDescription}>{description}</p>

    </div>
  );
}

export default InfoCard;