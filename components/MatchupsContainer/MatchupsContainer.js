import { useRef } from 'react';
import styles from './MatchupsContainer.module.css';
import Matchup from './Matchup/Matchup';
import { Button } from "reactstrap";

export default function MatchupsContainer({ matchups }) {
  

  return (
    <div className='mx-5 my-10'>
      <div className='text-4xl'>Games Today</div>
      <div className='flex flex-wrap'>
        {matchups.map((matchup, index) => (
          <Matchup key={index} matchup={matchup} />
        ))}
      </div>
     
    </div>
  )
}