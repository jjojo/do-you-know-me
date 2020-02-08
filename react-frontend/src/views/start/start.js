import React, { useContext, useEffect, useState, useCallback } from 'react'
import { useHistory } from "react-router-dom";
import { Socket, GameState } from '../../contexts';
import './start.scss'
import { SocketContext } from '../../sockets/socketProvider';

const Start = (props) => {
  console.log(props)
  const {socket} = useContext(SocketContext)
  const {gameState} = useContext(GameState)
  const [gameId, setGameId] = useState('');
  const history = useHistory();

  const goTo = useCallback((path) => history.push(path), [history])

  useEffect(() => {
    if (gameState && sessionStorage.getItem('playerId')) return goTo(`game/${gameState.id}/${sessionStorage.getItem('playerId')}`)
    if (gameState) return goTo(`game/${gameState.id}`)
  }, [gameState, goTo])

  const connectToGame = (e) => {
    e.preventDefault();
    socket.send(JSON.stringify({action: "JOIN_GAME", id: gameId}));
  }

  const handleInput = (e) => setGameId(e.target.value);

  return (<>
    <div>
      <p>{}</p>
      Or Join a game <br/>
      <form id="joinRoomForm" onSubmit={connectToGame}>
        <input type="text" onChange={handleInput} value={gameId} autoFocus></input>
      </form>
      <br/>
      <button type={'submit'} form={'joinRoomForm'}>
        Join game
      </button>
    </div>
    <button onClick={() => socket.send(JSON.stringify({action: "GET_GAME_STATE"}))}>GET_GAME_STATE</button>
    <button onClick={() => socket.send(JSON.stringify({action: "CREATE_GAME", id: null}))} disabled={!socket}>CREATE_GAME</button>
  </>);
}

export default Start;