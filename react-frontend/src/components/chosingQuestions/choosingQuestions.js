import React, {useEffect, useContext, useState} from 'react'
import './choosingQuestions.scss'
import { Socket, Questions, GameState } from '../../contexts'
import usePlayer from '../../hooks/usePlayer';
import { SocketContext } from '../../sockets/socketProvider';

const ChoosingQuestions = (props) => {
  const { questions } = useContext(Questions);
  const { gameState } = useContext(GameState);
  const [ qs, setQs ] = useState(null);
  const { player } = usePlayer();
  const [ points, setPoints ] = useState(null);
  const [ qIndex, setQIndex ] = useState(0);

  const { socket } = useContext(SocketContext)

  useEffect(() => {
    if(socket) socket.send(JSON.stringify({action: "GET_QUESTIONS"}))
  }, [socket])

  useEffect(() => {
    if(questions) {
      if(!points) setPoints(Array.from(new Set(questions.map(q => q.points))))
      setQs(questions.filter(q => q.points === (!points ? Array.from(new Set(questions.map(q => q.points))) : points)[0]))
    }
  },[questions, points]);

  const pickQuestion = (question) => {
    const pointsLeft = points.filter(p => p !== question.points)
    setPoints(pointsLeft)
    socket.send(JSON.stringify({
      action: "ADD_QUESTION", 
      id: gameState.id,
      playerId: player.id,
      questionId: question.id, 
    }))
    if (pointsLeft.length === 0) socket.send(JSON.stringify({
      action: "SET_PLAYER_READY",
      id: gameState.id,
      playerId: player.id,
      ready: true,
    }))
  };

  return (<>
    {qs ? <main>
        {qs.length > 0 
          ? <>
            <h2>For {qs[qIndex].points} points</h2>
            <h1>{qs[qIndex].question}</h1>
          </>
          : <>
            <h1>{props.ready && 'You are ready ⭐️'}</h1>
            <h2>Waiting for ⏳<br/>{Object.keys(gameState.players).map(key => {
              const player = gameState.players[key];
              return !player.ready && <span key={player.id}>{player.emoji}</span>
            })}</h2>
        </>}      
      </main>
    : <p>⏳</p>}
    <footer>
      {player && !player.ready && <>
        <button onClick={() => setQIndex((qIndex + 1) % qs.length)}>
          <span role="img" aria-label="reject">❌</span>
        </button>
        <button onClick={() => {
          setQIndex(0)
          pickQuestion(qs[qIndex])
        }}>
          <span role="img" aria-label="accept">✅</span>
        </button>
      </>}
    </footer>
  </>)
}

export default ChoosingQuestions;