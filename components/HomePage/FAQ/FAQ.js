"use client";

import { useState } from "react";
import styles from './FAQ.module.css';
import { motion } from "framer-motion";

export default function FAQ({ question, answer}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <div className={styles.faqContainer} onMouseOver={() => setIsFlipped(true)} onMouseOut={() => setIsFlipped(false)}>
      <div className={styles.flipCard} >
        <motion.div 
        className={styles.flipCardInner}
        initial={false} animate={{rotateY: isFlipped ? 0 : 180}}
        transition={{duration: 0.3}}
        onAnimationComplete={() => setIsAnimating(false)}>
          <div className={styles.flipCardFront}>
            <div>
              <span>{answer}</span>
            </div>
          </div>
          <div className={styles.flipCardBack}>
            <div>
              <span>{question}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}