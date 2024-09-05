import { useRef } from 'react';
import styles from './MatchupsContainer.module.css';
import Matchup from './Matchup/Matchup';
import { Button } from "reactstrap";

export default function MatchupsContainer({ matchups }) {
  

  return (
    <div className='mx-5 my-8'>
      <div className='font-semibold text-3xl'>Games Today</div>
      <div className='flex justify-center flex-wrap'>
        {matchups.map((matchup, index) => (
          <Matchup key={index} matchup={matchup} />
        ))}
      </div>
     
    </div>
  )
}