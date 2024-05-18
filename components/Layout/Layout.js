import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from './Layout.module.css';
import Header from '@/components/Header/Header';
import BaseDropdownMenu from '@/components/BaseDropdownMenu/BaseDropdownMenu';
import PlayerPropsContainer from '@/components/PropPage/PlayerPropsContainer/PlayerPropsContainer';

const Layout = ({ children, leagues, league, fantasyApps, books, positions, props, matchups }) => {
  const defaultProperties = ['*'];
  // var defaultLeague = (league === 'All') ? [['MLB', 'NHL', 'NBA']] : [league];

  const [selectedOptions, setSelectedOptions] = useState({
    leagues: league,
    fantasyApps: fantasyApps.filter(fantasyApp => fantasyApp !== 'All'),
    books: books.filter(book => book !== 'All'),
    positions: positions.filter(position => position !== 'All'),
    props: props.filter(prop => prop !== 'All'),
    matchups: matchups.filter(matchup => matchup !== 'All'),
  });

  const calculateProperties = () => {
    switch (selectedOptions.leagues) {
      case 'nba':
        return ['Assists', 'PointsReboundsAssists', 'Points', 'Rebounds', 'Threes'];
      case 'nhl':
        return ['Shots', 'Points'];
      case 'mlb':
        return ["Hits", "TotalBases", "RBIs", "Runs", "Singles", "Doubles", "RunsAllowed", "HitsAllowed", "PitcherStrikeouts"];
      default:
        return defaultProperties;
    }
  };
  const properties = calculateProperties();

  const calculateLeague = () => {
    // find the currently selected league
    return (league === 'All') ? ['MLB', 'NHL', 'NBA'] : [league];
  }

  const handleOptionChange = (optionType, optionValue) => {
    let updatedOptions = { ...selectedOptions, [optionType]: optionValue };
    if (optionValue === 'All') {
      console.log('Option value is All')
      switch (optionType) {
        case 'book':
          updatedOptions.books = ['williamhill', 'betonline'];
          break;
        case 'fantasyApp':
          updatedOptions.fantasyApps = ['prizepicks', 'underdog'];
          break;
        // Add more cases for other options if needed
        default:
          break;
      }
    }
    setSelectedOptions(updatedOptions);
  };

  useEffect(() => {
    setSelectedOptions({
      leagues: calculateLeague(),
      books: books.filter(book => book !== 'All'),
      fantasyApps: fantasyApps.filter(position => position !== 'All'),
      positions: positions.filter(position => position !== 'All'),
      props: calculateProperties(),
      matchups: matchups.filter(matchup => matchup !== 'All')
    });
  }, []);

  useEffect(() => {
    console.log('selectedOptions:', selectedOptions);
  }, [selectedOptions]);

  return (
    <>
      <Head>
        <title>Sport Wizzard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={`page`}>
        <Header />
          <div className={styles.dropdownContainer}>
            <div className={styles.dropdownsWrapper}>
              <BaseDropdownMenu options={leagues} selectedOption={selectedOptions.leagues} onChange={(value) => handleOptionChange('league', value)} />
              <BaseDropdownMenu options={fantasyApps} selectedOption={selectedOptions.fantasyApps} onChange={(value) => handleOptionChange('fantasyApp', value)} />
              <BaseDropdownMenu options={books} selectedOption={selectedOptions.books} onChange={(value) => handleOptionChange('book', value)} />
              <BaseDropdownMenu options={positions} selectedOption={selectedOptions.positions} onChange={(value) => handleOptionChange('position', value)} />
              <BaseDropdownMenu options={props} selectedOption={selectedOptions.props} onChange={(value) => handleOptionChange('prop', value)} />
              <BaseDropdownMenu options={matchups} selectedOption={selectedOptions.matchups} onChange={(value) => handleOptionChange('matchup', value)} />
            </div>
          </div>
          <div className={styles.propsContainer}>
            <PlayerPropsContainer 
              leagues={selectedOptions.leagues}
              books={selectedOptions.books} // You can pass selected values or whatever logic you need here
              fantasyApps={selectedOptions.fantasyApps}
              properties={selectedOptions.props} />
          </div>
          {children}
      </main>
    </>
  );
};

export default Layout;
