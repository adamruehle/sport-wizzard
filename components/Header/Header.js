"use client";
import React, {useState, useEffect, useRef} from 'react';
import styles from './Header.module.css';
import Link from 'next/link';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isControlledByClick, setIsControlledByClick] = useState(false);
  const openTimeoutRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  const handleClick = () => {
    setIsOpen(!isOpen);
    setIsControlledByClick(!isControlledByClick);
  };
  
  const handleMouseEnter = () => {
    clearTimeout(closeTimeoutRef.current); // Clear the close timeout
    openTimeoutRef.current = setTimeout(() => {
      if (!isControlledByClick) {
        setIsOpen(true);
      }
    }, 500); // Open after 500ms
  };
  
  const handleMouseLeave = () => {
    clearTimeout(openTimeoutRef.current); // Clear the open timeout
    closeTimeoutRef.current = setTimeout(() => {
      if (!isControlledByClick) {
        setIsOpen(false);
      }
    }, 500); // Close after 500ms
  };

  return (
    <header>
      <nav className={`${styles.stickyHeader}`}>
        <div className={styles.headerContent}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div className="text-whitesmoke mt-8 font-bold text-3xl md:text-4xl lg:text-5xl no-underline">Sport Wizzard</div>
          </Link>
          <div className={styles['navLinks']}>
            <Link className={styles.link} href="/leagues/nba/nba-book-props">NBA</Link>
            <Link className={styles.link} href="/leagues/mlb/mlb-book-props">MLB</Link>
            <Link className={styles.link} href="/leagues/nhl/nhl-book-props">NHL</Link>
            <Link className={styles.link} href="/leagues/nfl/nfl-book-props">NFL</Link>
            <Link className={styles.link} href="/leagues/soccer/soccer-book-props">Soccer</Link>
            <Link className={styles.link} href="/leagues/golf/golf-book-props">Golf</Link>
            <Link className={styles.link} href="/leagues/wnba/wnba-book-props">WNBA</Link>
            <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
              <DropdownTrigger className={styles.dropdown} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick}>
                <Button className={styles.dropdownTrigger}>•••</Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Leagues" className={styles.dropdownMenu} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <DropdownItem className={styles.dropdownItem}>
                  <Link href="/leagues/ncaab/ncaab-book-props" className={styles.dropdownLink}>NCAAB</Link>
                </DropdownItem>
                <DropdownItem className={styles.dropdownItem}>
                  <Link href="leagues/ncaaf/ncaaf-book-props" className={styles.dropdownLink}>NCAAF</Link>
                </DropdownItem>
                <DropdownItem className={styles.dropdownItem}>
                  <Link href="leagues/mma/mma-book-props" className={styles.dropdownLink}>MMA</Link>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <hr className={styles['horizontalLine']} />
      </nav>
    </header>
  );
}

export default Header