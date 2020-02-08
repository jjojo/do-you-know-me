import React, { useContext} from 'react';
import './questionPopUp.scss';
import { GameState } from '../../contexts';
import PlayerEmojiUsername from '../playerEmojiUsername/playerEmojiUsername';

const QuestionPopUp = () => {
  const { gameState } = useContext(GameState)

  const rephraseQuestion = (question) => {
    if(question.question.includes('your')) {
      return question.question.replace('your', `${gameState.players[question.playerId].username.charAt(0).toUpperCase() + gameState.players[question.playerId].username.slice(1)}'s`)
    }
    if(question.question.includes('you')) {
      return question.question.replace('you', `${gameState.players[question.playerId].username.charAt(0).toUpperCase() + gameState.players[question.playerId].username.slice(1)}`)
    }
  }
  
  return (<div className={'wrapper'}>{
    console.log(gameState.activeQuestion)}
    {gameState && gameState.activeQuestion &&
    <div className={'question-pop-up'} style={{backgroundColor: `${gameState.players[gameState.activeQuestion.playerId].color}`}}>
      <span>{gameState.players[gameState.activeQuestion.playerId].emoji}</span>
      <h1>
        {rephraseQuestion(gameState.activeQuestion)}
      </h1>
      <section>
        {Object.keys(gameState.players)
          .filter(key => key !== gameState.activeQuestion.playerId)
          .map((key, i) => {
            return <>
              {!Object.keys(gameState.activeQuestion.answers).includes(gameState.players[key].id) && <span role={'img'} aria-label={'hourglass'}>⏳</span>}
              <PlayerEmojiUsername player={gameState.players[key]} key={i + 'name'}/>
            </>
          })}
      </section>
    </div>
  }</div>)
}

export default QuestionPopUp;