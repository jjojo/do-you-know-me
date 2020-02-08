import React, {useContext, useState, useEffect} from 'react'
import './correctAnswers.scss'
import { GameState, Socket } from '../../../contexts';
import { SocketContext } from '../../../sockets/socketProvider';

const CorrectAnswers = () => {
  const { gameState } = useContext(GameState);
  const { socket } = useContext(SocketContext)
  const [answer, setAnswer] = useState(false)

  useEffect(() => {
    if (Object.keys(gameState.activeQuestion.answers).length > 0) {
      setAnswer(Object.keys(gameState.activeQuestion.answers)
        .filter(key => !gameState.activeQuestion.answers[key].hasOwnProperty('correct'))
        .map(key => gameState.activeQuestion.answers[key])[0])
    } 
  }, [gameState])

  const correctAnswer = (event, bool) => {
    event.preventDefault()
    socket.send(JSON.stringify({
      action: "CORRECT_ANSWER",
      id: gameState.id,
      playerId: answer.playerId,
      correct: bool,
    }))
  }

  return (<>
    <main>
      <h1>This is your question! Answers will come in soon, stay ready!</h1>
      <p>
        {answer && answer.answer}
      </p>
    </main>
    <footer>
      <button onClick={(e) => correctAnswer(e, false)}>
        <span role="img" aria-label="reject">❌</span>
      </button>
      <button onClick={(e) => correctAnswer(e, true)}>
        <span role="img" aria-label="accept">✅</span>
      </button>
    </footer>
    
  </>)
}

export default CorrectAnswers;