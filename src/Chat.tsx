// src/App.tsx
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import io from 'socket.io-client';
import './App.css';
import { TextField } from '@mui/material';
import { useWallet } from '@xpla/wallet-provider';

interface ChatMessage {
  address: string;
  message: string;
}

const Chat: React.FC = () => {
  const [state, setState] = useState<{ message: string; }>({ message: '' });
  const [chat, setChat] = useState<ChatMessage[]>([]);

  const socket = io(process.env.REACT_APP_ENV !== "development" ? process.env.REACT_APP_API_URL || '' : 'http://localhost:5641/',  process.env.REACT_APP_ENV !== "development" ? {
    path : '/discord/socket.io'
  } : undefined);
  const { status, wallets } = useWallet();

  useEffect(() => {
    socket.on('message', (msg: ChatMessage) => {
      setChat((prevChat) => [...prevChat, msg]);
    });

    socket.on('chat history', (history: ChatMessage[]) => {
      console.log(history)
      setChat(history);
    });
  }, []);

  const onTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onMessageSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { message } = state;
    socket.emit('message', { address: wallets[0].xplaAddress, message });
    setState({ message: '' });
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
    <div className="flex flex-col min-h-[calc(100vh-100px)] justify-between">
      <div className="flex flex-1 flex-col h-full render-chat ">
        <h1>채팅 목록</h1>
        {renderChat()}
      </div>
      <form onSubmit={onMessageSubmit} className="">
        <h1>채팅</h1>
        <div className="flex gap-2">
          <div>
            <TextField
              name="message"
              onChange={onTextChange}
              value={state.message}
              variant="outlined"
              label="Message"
            />
          </div>
          <button className="border">보내기</button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
