// src/socket.js
import { io } from 'socket.io-client';

console.log('🔧 Attempting to connect to socket server...');

const socket = io('http://localhost:9000', {  // CHANGE THIS TO MATCH YOUR SERVER PORT
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  transports: ['websocket', 'polling'],
});

socket.on('connect', () => {
  console.log('✅ Connected to server:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error.message);
});

socket.on('disconnect', (reason) => {
  console.log('⚠️ Disconnected:', reason);
});

export default socket;