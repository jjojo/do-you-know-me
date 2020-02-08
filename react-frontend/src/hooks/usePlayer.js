import {useState, useContext, useEffect} from 'react'
import { GameState } from '../contexts'

const usePlayer = () => {
  const {gameState} = useContext(GameState)
  const [player, setPlayer] = useState();

  useEffect(() => {
    if (gameState) {
      setPlayer(gameState.players[sessionStorage.playerId])
    }
  }, [gameState])

  return { player }
}

export default usePlayer;