import React, { useState, useEffect } from 'react';
import './App.css';
import { useLocalStorage } from './hook/localStorage';

const App = () => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [ws, setWs] = useState(null);
  const { getItem, setItem} = useLocalStorage("userName");

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:4000');
    websocket.onopen = () => {
      console.log('Connected to WebSocket server');
      setWs(websocket);
    };
    websocket.onmessage = (event) => {
      setComments((prevComments) => [...prevComments, event.data]);
    };
    websocket.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };
    websocket.onerror = (error) => {
      console.log('WebSocket error:', error);
    };

    // Cleanup on component unmount
    return () => {
      websocket.close();
    };
  }, []);

  useEffect(() => {
    const button = document.getElementById("sendButton");

    const enterHandle = (event) =>{
      if(event.key === "Enter"){
        event.preventDefault();
        button.click();
      }
    }

    window.addEventListener('keypress', enterHandle);
    
    return () => window.removeEventListener('keypress', enterHandle);
  },[])

  const sendComment = () => {
    if (comment && ws) {
      ws.send(comment);
      setComment('');
    }
  };

  return (
    <div className="App">
      <h1>Comment Board</h1>
      <div id="comments">
        {comments.map((cmt, index) => (
          <div key={index}>{cmt}</div>
        ))}
      </div>
      <div id="inputs">
        <div>
          <label>UserName:</label>
          <input
            type='text'
            placeholder='Anonymous'
            onChange={(e) => {
              setItem(e.target.value);
            }
            }
            />
        </div>
        <div>
          <label id='commentInput' >Comment: </label>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comment"
          />
        </div>
        <button id="sendButton" onClick={sendComment}>Send</button>
      </div>

    </div>
  );
};

export default App;
