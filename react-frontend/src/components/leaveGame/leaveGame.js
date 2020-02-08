import React, {useContext} from 'react'
import { useHistory } from "react-router-dom";
import './leaveGame.scss'
import { Socket, GameState } from '../../contexts'
import { SocketContext } from '../../sockets/socketProvider';

const LeaveGame = () => {
  const { socket } = useContext(SocketContext)
  const { setGameState } = useContext(GameState)
  const history = useHistory();

  const onLeave = () => {
    setGameState(null);
    sessionStorage.clear();
    socket.close();
    history.push('/');
  }

  return (
    <div className="leave-game">
      <button onClick={onLeave}>Leave game</button>
    </div>
  )
}

export default LeaveGame;