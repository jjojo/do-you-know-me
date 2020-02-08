import React,{ useContext, useEffect } from 'react';
import { GameState } from '../../contexts';
import LeaveGame from '../../components/leaveGame/leaveGame';
import './gameController.scss';
import ChoosingQuestions from '../../components/chosingQuestions/choosingQuestions';
import Playing from '../../components/playing/playing';
import usePlayer from '../../hooks/usePlayer';
import { SocketContext } from '../../sockets/socketProvider';

function PlayerScreen(props) {
  const { gameState } = useContext(GameState);
  const { socket, setSocket } = useContext(SocketContext)
  const { player } = usePlayer();

  useEffect(() => {
    if (socket.readyState === 1) socket.send(JSON.stringify({action: "GET_GAME_STATE", id: props.match.params.id, playerId: props.match.params.playerId}))
  }, [socket, socket.readyState, props.match.params.id, props.match.params.playerId])

  const sendUsername = (username) => {
    socket.send(JSON.stringify({
      action: "SET_USERNAME", 
      id: gameState.id,
      playerId: player.id,
      username,
    }))
  }

  return (<>{
    player && sessionStorage.getItem('playerId') 
      ? <div className="game-controller">
          <header style={{backgroundColor: player.color || '#fff'}}>
            <h2>
              <span>{gameState.name}</span>
              <LeaveGame />
              <span>
                Game Id: {gameState.id}
              </span>
            </h2>
              <span>
                {player.emoji}
                <input 
                  type="text" 
                  onChange={(e) => sendUsername(e.target.value)} 
                  placeholder={player.username || 'Username'}
                  maxLength="20"
                  defaultValue={player.username || 'Username'}
                  autoFocus/>
              </span>
          </header>
          {!gameState.gameStarted
            ? <ChoosingQuestions/>
            : <Playing/>
          }
        </div>
      : <p>Loading or you are not a player in this game...</p>}
    <pre style={{overflow: 'auto'}}>{ JSON.stringify(gameState, null, "  ") }</pre>
  </>);
}

export default PlayerScreen;
