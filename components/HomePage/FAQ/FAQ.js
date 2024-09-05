"use client";

import { useState } from "react";
import styles from './FAQ.module.css';
import { motion } from "framer-motion";

export default function FAQ({ question, answer}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <div className={styles.faqContainer} onClick={()=>setIsFlipped(!isFlipped)} onMouseOver={() => setIsFlipped(true)} onMouseOut={() => setIsFlipped(false)}>
      <div className={`${styles.flipCard}`} >
        <motion.div 
        className={styles.flipCardInner}
        initial={false} animate={{rotateY: isFlipped ? 0 : 180}}
        transition={{duration: 0.2}}
        >
          <div className={`${styles.flipCardFront}`}>{answer}</div>
          <div className={`${styles.flipCardBack}`}>{question}</div>
        </motion.div>
      </div>
    </div>
  )
}