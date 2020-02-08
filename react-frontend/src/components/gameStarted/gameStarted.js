import React, {useEffect, useState} from 'react'
import './gameStarted.scss'

const GameStarted = (props) => {
  const [animation, setAnimation] = useState('');

  useEffect(() => {
    if (props.started) {
      setAnimation('start-animation')
    }
  }, [props.started, setAnimation])

  return (<div className={'game-started'}>
    <h1 className={animation}>GAME STARTED</h1>
  </div>)
}

export default GameStarted;