import { io } from 'socket.io-client';

export const socket = io(process.env.REACT_APP_ENV !== "development" ? process.env.REACT_APP_API_URL || '' : 'http://localhost:5642/', {
  ...(process.env.REACT_APP_ENV !== "development" && { path: '/discord/socket.io' }),
  reconnectionAttempts: 5, // 최대 재시도 횟수
  reconnectionDelay: 12000, // 각 재시도 간의 지연 시간 (12초)
});