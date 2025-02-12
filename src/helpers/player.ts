import { Socket } from 'socket.io';
import { io } from '../../index.ts';
import { MOBILE } from '../constants/sockets.ts';
import { ONLINE_USERS } from '../game.ts';
import { Player } from '../interfaces/Player.ts';
import { sendPlayerDisconnectedToWeb, sendPlayerRemoved } from '../sockets/emits/user.ts';

// Returns a player searched by id
export const findPlayerById = (_id: string): Player | undefined => {
  const user = ONLINE_USERS.find((player) => player._id === _id);
  return user;
};

// Returns a player searched by socketid
export const findPlayerBySocketId = (id: string): Player | undefined => {  
  const user = ONLINE_USERS.find((player) => player.socketId === id);
  return user;
};

// Removes the player that got disconnected from playerConnected[] global variable
export const removePlayerConnected = (socket: Socket, socketId: string): void => {
  const userIndex = ONLINE_USERS.findIndex((user) => user.socketId === socketId);
  if (userIndex != -1) {
    console.log('Player with email', ONLINE_USERS[userIndex].email, 'and socket', ONLINE_USERS[userIndex].socketId, 'disconnected');
    socket.leave(MOBILE);
    sendPlayerRemoved(io,ONLINE_USERS[userIndex]);
    sendPlayerDisconnectedToWeb(io,ONLINE_USERS[userIndex].nickname);
    ONLINE_USERS.splice(userIndex, 1);
  } else {
    console.log('No players found with the received socket');
  }
};

// Returns a player searched by email
export const findPlayerByEmail = (email: string): Player | undefined => {
  const user = ONLINE_USERS.find((player) => player.email === email);
  return user;
};

// Returns a boolean if a player is connected. searched by email
export const isPlayerConnected = (email: string): boolean => {
  return ONLINE_USERS.some((player) => (player.email === email));
};

export const isMortimerDisconnected = (socketId: string): boolean => {
  const isMortimerDisconnected = ONLINE_USERS.some((user)=> (user.socketId === socketId && user.role === 'mortimer'));
  return isMortimerDisconnected;
};