import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config/env';

let socket = null;

export function getSocket() {
  if (!socket) {
    const token = localStorage.getItem("token")
    socket = io(SOCKET_URL,{
      autoConnect: false,
      auth: {token},
    }) 
  }
  return socket;
}

export function connectSocket() {
  const token = localStorage.getItem("token");
  if(!token) return null;
  if(socket) {
    socket.auth = {token};
  }
  const s = getSocket();
  if (!s.connected) {
    s.auth = {token};
    s.connect();
  }
  return s;
}

export function disconnectSocket() {
  if (socket?.connected) {
    socket.disconnect();
  }
  socket = null;
}

export default getSocket;
