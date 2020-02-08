import React, {useContext} from 'react';
import './question.scss';
import { GameState } from '../../contexts';

const Question = (props) => {
  const { gameState } = useContext(GameState);
  
  return (<>{gameState &&
    <> {gameState.turn === sessionStorage.playerId
      ? <div className={`question`}
          style={{backgroundColor: `${props.question.focus && props.player.color}`}}>
          {props.question.points}
        </div>
      : <div className={`
        question 
        ${gameState.turn === props.question.playerId && gameState.gameStarted ? 'disabled' : ''} 
        ${props.question.focus && props.player.id !== gameState.turn ? 'focused' : ''}`} 
          style={{
            backgroundColor: `${props.question.focus ? gameState.players[gameState.turn].color : '#ffffff'}`,
            ...props.style,
            opacity: `${props.question.answered ? '0' : '1'}`,
            }}>
          {props.question.points}
          <span>{props.question.focus ? gameState.players[gameState.turn].emoji : ''}</span>
        </div>}
    </>}
  </>)
}

export default Question;