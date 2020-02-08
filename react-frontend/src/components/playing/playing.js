import React, {useContext} from 'react'
import PickQuestion from './pick-question/pickQuestion';
import AnswerQuestion from './answer-question/answerQuestion';
import CorrectAnswers from './correct-answers/correctAnswers';
import { GameState } from '../../contexts';
import usePlayer from '../../hooks/usePlayer';
import './playing.scss'

const Playing = () => {
  const { gameState } = useContext(GameState);
  const { player } = usePlayer();

  const getPlayersQuestions = (playerId) => Object.keys(gameState.players[playerId].questions).map(key => gameState.players[playerId].questions[key])

  const focusableQuestions = () => (Object.keys(gameState.players)
    .filter(key => player && gameState.players[key].id !== player.id)
    .map(key => getPlayersQuestions(key))
    .flat()
    .filter(q => !q.answered))

  return (<>{ gameState && player && 
    !gameState.activeQuestion
      ? <>{gameState.turn === player.id && focusableQuestions().length > 0
            ? <PickQuestion questions={focusableQuestions()} player={player}/>
            : <>{ !gameState.results 
              ? <>
                  <h1>⏳<br/>Waiting for <span>{gameState.players[gameState.turn].emoji} to pick a question</span></h1>
                  <footer></footer></>
              : <p>Game has ended your score was: {player.points}, and you got the {gameState.results.findIndex(resPlayer => resPlayer.id === player.id) + 1} place!</p>}
              </>}
        </>
      : <>{
            gameState.activeQuestion && gameState.activeQuestion.playerId === player.id
              ? <CorrectAnswers/>
              : <>{ gameState.activeQuestion && <AnswerQuestion/>}</>
          }
        </>}
  </>)
}

export default Playing;