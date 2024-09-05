import React from 'react';
import styles from './InfoCard.module.css';

const InfoCard = ({ title, description }) => {
  return (
    <div className={styles.infoCard}>
      <h2 className={`text-2xl font-bold sm:text-4xl`}>{title}</h2>
      <p className={`text-lg sm:text-2xl`}>{description}</p>

    </div>
  );
}

export default InfoCard;