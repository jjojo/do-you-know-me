import React, { useContext} from 'react';
import { useHistory } from "react-router-dom";
import { GameState } from '../../contexts';
import PlayerEmojiUsername from '../playerEmojiUsername/playerEmojiUsername';
import './showResults.scss';
import { SocketContext } from '../../sockets/socketProvider';

const ShowResults = () => {
  const history = useHistory();
  const { socket } = useContext(SocketContext)
  const { setGameState } = useContext(GameState)
  const { gameState } = useContext(GameState)
  
  return (<div className={'wrapper'}>
      <div className={'result-pop-up'}>
        <h1>RESULTS:</h1>
        {gameState.results.map((player) => {
          return (<>
            <PlayerEmojiUsername 
              key={player.id} 
              score={player.points}
              player={player} 
              textColor={player.color}/>
          </>)
        })}
        <button onClick={() => {
          sessionStorage.clear()
          history.push('/')
          setGameState(null);
          socket.close();
        }}>Quit game</button>
      </div>
  }</div>)
}

export default ShowResults;