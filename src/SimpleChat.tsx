// src/App.tsx
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import io from 'socket.io-client';
import './App.css';
import { TextField } from '@mui/material';

interface ChatMessage {
  address: string;
  message: string;
}

const socket = io('http://localhost:5641/');

const App: React.FC = () => {
  const [state, setState] = useState<{ message: string; address: string }>({ message: '', address: '' });
  const [chat, setChat] = useState<ChatMessage[]>([]);

  useEffect(() => {
    socket.on('message', (msg: ChatMessage) => {
      setChat((prevChat) => [...prevChat, msg]);
    });

    // 서버에서 이전 채팅 기록을 받아옴
    socket.on('chat history', (history: ChatMessage[]) => {
      setChat(history);
    });
  }, []);

  const onTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onMessageSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { address, message } = state;
    socket.emit('message', { address, message });
    setState({ message: '', address });
  };

  const renderChat = () => {
    return chat.map(({ address, message }, index) => (
      <div key={index}>
        <h3>
          {address}: <span>{message}</span>
        </h3>
      </div>
    ));
  };

  return (
    <div className="card">
      <form onSubmit={onMessageSubmit}>
        <h1>Message</h1>
        <div className="name-field">
          <TextField
            name="address"
            onChange={onTextChange}
            value={state.address}
            label="address"
          />
        </div>
        <div>
          <TextField
            name="message"
            onChange={onTextChange}
            value={state.message}
            variant="outlined"
            label="Message"
          />
        </div>
        <button>Send Message</button>
      </form>
      <div className="render-chat">
        <h1>Chat log</h1>
        {renderChat()}
      </div>
    </div>
  );
};

export default App;
