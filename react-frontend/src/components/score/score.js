import React, { useEffect, useState, useRef } from 'react';
import './score.scss';
import { timeout } from 'q';

const Score = (props) => {
  //const [speed, setSpeed] = useState(1000);
  const [ ones, setOnes ] = useState(0);
  const [animation, setAnimation] = useState('')
  //const digits = [0,1,2,3,4,5,6,7,8,9]


  useEffect(() => {
    //setAnimation(() => 'move-under')
    setAnimation(() => 'roll-up')
    setTimeout(() => setAnimation(''), 1000)
    /* TODO: Make every number rotate */
    // const diff = Math.abs(ones - props.score);
    // const interval = setInterval(() => {
    //   setAnimation(() => '')
    //   setAnimation(() => 'roll-up')
    //   setOnes(ones => ones + 1)
    // }, 1000, ones)
    // setTimeout(() => clearInterval(interval), diff*speed)
  }, [props.score])

  return (
    <div className={'score'}>
      <h1 className={animation}>{props.score}</h1>
    </div>
  )
}

export default Score;