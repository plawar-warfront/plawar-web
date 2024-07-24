// src/App.tsx
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { TextField } from '@mui/material';
import { useWallet } from '@xpla/wallet-provider';
import { socket } from '../../socket';
import RenderChat from './RenderChat';

export interface ChatMessage {
  address: string;
  message: string;
}

const Chat: React.FC = () => {
  const [state, setState] = useState<{ message: string; }>({ message: '' });
  const [chat, setChat] = useState<ChatMessage[]>([]);

  const { wallets } = useWallet();

  useEffect(() => {
    socket.emit('get chat history');

    const onMessage = (msg: ChatMessage) => {
      setChat((prevChat) => [...prevChat, msg]);
    }
    const onChatHistory = (history: ChatMessage[]) => {
      setChat(history);
    }

    socket.on('message', onMessage);
    socket.on('chat history', onChatHistory);

    return () => {
      socket.off('message', onMessage);
      socket.off('chat history', onChatHistory);
    }

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

  return (
    <div className="flex flex-col h-full justify-between mr-4 py-8">
      <h1>채팅 목록</h1>
      <RenderChat chat={chat}  userAddress={wallets[0].xplaAddress}/>
      <form onSubmit={onMessageSubmit} className="">
        <h1>채팅</h1>
        <div className="flex gap-2">
          <TextField
            name="message"
            onChange={onTextChange}
            value={state.message}
            variant="outlined"
            label="Message"
            required
          />
          <button className="border">보내기</button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
