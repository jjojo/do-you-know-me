import React,{ useContext, useEffect } from 'react';
import { GameState } from '../../contexts';
import LeaveGame from '../../components/leaveGame/leaveGame';
import PlayerEmojiUsername from '../../components/playerEmojiUsername/playerEmojiUsername';
import Question from '../../components/question/question';
import './gameScreen.scss';
import GameStarted from '../../components/gameStarted/gameStarted';
import QuestionPopUp from '../../components/questionPopUp/questionPopUp';
import Score from '../../components/score/score';
import ShowResults from '../../components/showResults/showResults';

function GameScreen(props) {
  console.log(props);
  const { gameState } = useContext(GameState);

  useEffect(() => {
    if (gameState) sessionStorage.setItem('gameId', gameState.id)
  }, [gameState])

  const fullScreen = () => {
    document.getElementsByClassName("game-screen")[0].requestFullscreen();
  }

  return (<>{ gameState 
    ? <div className={"game-screen"}>
        <GameStarted started={gameState.gameStarted}/>
        {gameState.results && <ShowResults></ShowResults>}
        <header>
          <h1> 
            <LeaveGame/>
          </h1>
          <h3>Game code: {gameState.id}</h3>
          <button onClick={fullScreen}>fullscreen</button>
        </header>
        <main>
          { gameState.activeQuestion && <QuestionPopUp/>}
          {Object.keys(gameState.players).map((key, i) => {
            const player = gameState.players[key];
            return (
              <section style={{backgroundColor: player.color}} key={player.color}>
                <div className={'question-wrapper'}>
                  {Object.keys(player.questions)
                  .map((key) => {
                    return <Question
                      question={player.questions[key]} 
                      player={player} 
                      key={player.questions[key].question}>
                    </Question>
                  })}
                </div>
                <PlayerEmojiUsername player={player}/>
                <Score score={player.points}></Score>
              </section>
            )
          })}
        </main>
      </div>
      : <p>Loading game...</p>
  }
    <pre>{ JSON.stringify(gameState, null, "  ") }</pre>
  </>);
}

export default GameScreen;
