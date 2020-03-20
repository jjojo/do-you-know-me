import React, { useContext, useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { Socket, GameState } from "../../contexts";
import { SocketContext } from "../../sockets/socketProvider";
import s from "./start.module.scss";

const Start = props => {
  console.log(props);
  const { socket } = useContext(SocketContext);
  const { gameState } = useContext(GameState);
  const [gameId, setGameId] = useState("");
  const [username, setUsername] = useState("");
  const history = useHistory();

  const goTo = useCallback(path => history.push(path), [history]);

  useEffect(() => {
    if (gameState && sessionStorage.getItem("playerId"))
      return goTo(`game/${gameState.id}/${sessionStorage.getItem("playerId")}`);
    if (gameState) return goTo(`game/${gameState.id}`);
  }, [gameState, goTo]);

  const connectToGame = e => {
    e.preventDefault();
    socket.send(JSON.stringify({ action: "JOIN_GAME", id: gameId }));
  };

  const handleInput = setFn => e => setFn(e.target.value);

  return (
    <>
      <div className={s["root"]}>
        <h1>Welcome</h1>
        <button
          onClick={() =>
            socket.send(JSON.stringify({ action: "CREATE_GAME", id: null }))
          }
          disabled={!socket}
        >
          Create Game
        </button>
        <h2>Or Join a game</h2>
        <form id="joinRoomForm" onSubmit={connectToGame}>
          <label className={s["input-label"]} htmlFor="room-code">
            Enter room code
            <input
              type="text"
              name="room-code"
              onChange={handleInput(setGameId)}
              value={gameId}
              autoFocus
            ></input>
          </label>
          <label className={s["input-label"]} htmlFor="username">
            Username
            <input
              type="text"
              name="username"
              onChange={handleInput(setUsername)}
              value={username}
              autoFocus
            ></input>
          </label>
        </form>
        <br />
        <button type={"submit"} form={"joinRoomForm"}>
          Join game
        </button>
      </div>
    </>
  );
};

export default Start;
