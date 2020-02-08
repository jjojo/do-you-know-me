import React, {useState, useEffect, useContext} from "react";
import { GameState, Questions } from "../contexts";

export const SocketContext = React.createContext();

const SocketProvider = (props) => {
  const [socket, setSocket] = useState(new WebSocket("ws://localhost:9090"))
  
  // const { setGameState } = useContext(GameState);
  // const { setQuestions } = useContext(Questions);
  useEffect(() => {
    socket.onopen = () => {
      console.log("CONNECTED")
      if(sessionStorage.gameId) socket.send(JSON.stringify({action: "GET_GAME_STATE", id: sessionStorage.gameId}))
      if(sessionStorage.playerId) socket.send(JSON.stringify({action: "GET_GAME_STATE", id: sessionStorage.playerId}))
    } 
  });
  // useEffect(() => {
  //   if (socket) {
  //     socket.onopen = () => {
  //       socket.onmessage = ({data}) => {
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
  //     }
  //   }
  // }, [socket, setGameState, setQuestions])

return(
  <SocketContext.Provider value={{socket, setSocket}}>
    { props.children }
  </SocketContext.Provider>
  )
}
export default SocketProvider;