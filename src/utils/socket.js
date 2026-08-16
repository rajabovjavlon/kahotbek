import { io } from 'socket.io-client';

// Detect whether running in production (Render) or localhost
const SERVER_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001' 
  : window.location.origin;

export const socket = io(SERVER_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('[Kahotbek Socket] Connected to real-time server:', socket.id);
});

socket.on('disconnect', () => {
  console.log('[Kahotbek Socket] Disconnected from server');
});
