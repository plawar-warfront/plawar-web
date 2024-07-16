import { io } from 'socket.io-client';

export const socket = io(process.env.REACT_APP_ENV !== "development" ? process.env.REACT_APP_API_URL || '' : 'http://localhost:5641/',  process.env.REACT_APP_ENV !== "development" ? {
  path : '/discord/socket.io'
} : undefined);