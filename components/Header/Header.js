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
      <nav className={styles.stickyHeader}>
        <div className={styles.headerContent}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div className={styles.linkTitle}>Sport Wizzard</div>
          </Link>
          <div className={styles['navLinks']}>
            <Link className={styles.link} href="/leagues/nba-props">NBA</Link>
            <Link className={styles.link} href="/leagues/mlb-props">MLB</Link>
            <Link className={styles.link} href="/leagues/nhl-props">NHL</Link>
            <Link className={styles.link} href="/leagues/nfl-props">NFL</Link>
            <Link className={styles.link} href="/leagues/soccer-props">Soccer</Link>
            <Link className={styles.link} href="/leagues/golf-props">Golf</Link>
            <Link className={styles.link} href="/leagues/wnba-props">WNBA</Link>
            <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
              <DropdownTrigger className={styles.dropdown} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick}>
                <Button className={styles.dropdownTrigger}>•••</Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Leagues" className={styles.dropdownMenu} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <DropdownItem className={styles.dropdownItem}>
                  <Link href="/ncaab" className={styles.dropdownLink}>NCAAB</Link>
                </DropdownItem>
                <DropdownItem className={styles.dropdownItem}>
                  <Link href="/ncaaf" className={styles.dropdownLink}>NCAAF</Link>
                </DropdownItem>
                <DropdownItem className={styles.dropdownItem}>
                  <Link href="/mma" className={styles.dropdownLink}>MMA</Link>
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