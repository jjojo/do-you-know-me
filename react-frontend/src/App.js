import React,{useEffect, useState, useContext}  from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { 
  Socket,
  GameState,
  Questions,
 } from './contexts'
import './App.css';
import Start from './views/start/start';
import GameScreen from './views/gameScreen/gameScreen';
import PlayerScreen from './views/gameController/gameController';
import { SocketContext } from './sockets/socketProvider';

function App() {
  //const [socket, setSocket] = useState()
  const { socket } = useContext(SocketContext)
  const [gameState, setGameState] = useState()
  const [questions, setQuestions] = useState()

  useEffect(() => {
    if (socket) {
      
        socket.onmessage = ({data}) => {
          switch (JSON.parse(data).type) {
            case "GAME_STATE":
              return setGameState(JSON.parse(data).payload);
            case "PLAYER_ID":
              return sessionStorage.setItem('playerId', JSON.parse(data).payload)
            case "GAME_IN_PROGRESS":
              return setGameState(JSON.parse(data).payload);
            case "QUESTIONS":
              return setQuestions(JSON.parse(data).payload);
            default:
              return;
          }
        }
      }
    
  }, [socket, setGameState, setQuestions])

  // useEffect(() => {
  //   if (!socket) {
  //     const s = new WebSocket("ws://localhost:9000")
  //     s.onopen = () => {
  //       s.onmessage = ({data}) => {
  //         console.log("returned data", JSON.parse(data))
  //         switch (JSON.parse(data).type) {
  //           case "GAME_STATE":
  //             console.log("RETURNED GAME STATE: ", JSON.parse(data).payload)
  //             return setGameState(JSON.parse(data).payload);
  //           case "PLAYER_ID":
  //             return sessionStorage.setItem('playerId', JSON.parse(data).payload)
  //           case "QUESTIONS":
  //             return setQuestions(JSON.parse(data).payload);
  //           default:
  //             return;
  //         }
  //       }
  //       setSocket(s)
  //     }
  //   }
  // })

  useEffect(() => {
    console.log("GAME STATE UPDATED: ", gameState)
  }, [gameState])

  // useEffect(() => {
  //   if(socket) {
  //     socket.onmessage = ({data}) => {
  //       console.log("returned data", JSON.parse(data))
  //       switch (JSON.parse(data).type) {
  //         case "GAME_STATE":
  //           console.log("RETURNED GAME STATE: ", JSON.parse(data).payload)
  //           return setGameState(JSON.parse(data).payload);
  //         case "PLAYER_ID":
  //           return sessionStorage.setItem('playerId', JSON.parse(data).payload)
  //         case "QUESTIONS":
  //           return setQuestions(JSON.parse(data).payload);
  //         default:
  //           return;
  //       }
  //     }
  //   }
  // }, [socket])

  return (
    //<Socket.Provider value={{socket, setSocket}}>
      <Router>
        <GameState.Provider value={{gameState, setGameState}}>  
          <Route exact path="/" component={Start} />
          <Questions.Provider value={{questions, setQuestions}}>
            <Route exact path="/game/:id" component={GameScreen} />
            <Route exact path="/game/:id/:playerId" component={PlayerScreen} />
          </Questions.Provider>
        </GameState.Provider>
      </Router>      
    //</Socket.Provider>
  );
}

export default App;
