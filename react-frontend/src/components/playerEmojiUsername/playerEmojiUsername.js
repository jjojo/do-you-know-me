import React from "react";
import './playerEmojiUsername.scss'

const PlayerEmojiUsername = (props) => {
  return (<p style={{color: `${props.textColor}`}}>
    <span>{props.player.emoji}</span>
    {props.player.username} 
    {props.score && <span style={{
      color: '#000',
      fontSize: '2rem',
      marginLeft: '20px',
      }}>
      score: {props.score}
    </span>}
  </p>)
}

export default PlayerEmojiUsername;