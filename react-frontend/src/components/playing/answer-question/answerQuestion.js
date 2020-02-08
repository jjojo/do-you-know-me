import React, {useContext, useState} from 'react'
import { GameState, Socket } from '../../../contexts';
import usePlayer from '../../../hooks/usePlayer';
import './answerQuestion.scss'
import { SocketContext } from '../../../sockets/socketProvider';

const AnswerQuestion = () => {
  const { gameState } = useContext(GameState);
  const { socket } = useContext(SocketContext)
  const [answer, setAnswer] = useState(' ')

  const submitAnswer = (event) => {
    event.preventDefault()
    socket.send(JSON.stringify({
      action: "ANSWER",
      id: gameState.id,
      playerId: sessionStorage.playerId,
      answer,
    }))
    setAnswer(null)
  }

  return (<>
    {answer 
    ? <main>
        <h1>Time to answer, good luck!</h1>
        <form onSubmit={submitAnswer} id="answerForm">
          <textarea placeholder={'Type your answer here'} onChange={(e) => setAnswer(e.target.value)} />
        </form>
      </main>
    : <main>
        <h1>Waiting for {gameState.players[gameState.activeQuestion.playerId].emoji} to correct the answers</h1>
      </main>
    }
    <footer>
      {answer ? <button type="submit" form="answerForm" value="Submit">Submit Answer</button> : <></>}
    </footer>
  </>)
}

export default AnswerQuestion;