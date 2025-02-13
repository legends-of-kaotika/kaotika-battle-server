import { Socket } from 'socket.io';
import { io } from '../../index.ts';
import { MOBILE } from '../constants/sockets.ts';
import { ONLINE_USERS } from '../game.ts';
import { Player } from '../interfaces/Player.ts';
import { sendKilledPlayer, sendPlayerDisconnectedToWeb, sendPlayerRemoved } from '../sockets/emits/user.ts';
import { logUnlessTesting } from './utils.ts';

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

export const isPlayerConnectedById = (id : string, onlinePlayers: Player[]) : boolean => {
  return onlinePlayers.some((player) => player._id === id);
};

export function handlePlayerDeath(id: string, onlinePlayers: Player[]) : void{
  const isConnected = isPlayerConnectedById(id, onlinePlayers);

  if(!isConnected) return;

  sendKilledPlayer(io, id);
  removePlayerFromConectedUsersById(id, onlinePlayers);
}

export function removePlayerFromConectedUsersById(id: string, onlinePlayers: Player[]) : void{
  const index = onlinePlayers.findIndex(player => player._id === id);
  if(index === -1){
    logUnlessTesting(`FAILED to delete player with the id ${id} dont exist in ONLINE USER array`);
    return;
  }
  onlinePlayers.splice(index, 1);
}

export const findIfIsDeath = (DefenderId: string, AttackerId: string) => {
  const attacker = findPlayerById(AttackerId);
  const defender = findPlayerById(DefenderId);
  if(attacker?.attributes.hit_points === 0){
    handlePlayerDeath(AttackerId,ONLINE_USERS);
  }
  if(defender?.attributes.hit_points === 0){
    handlePlayerDeath(DefenderId,ONLINE_USERS);
  }
};

export const isMortimerDisconnected = (socketId: string): boolean => {
  const isMortimerDisconnected = ONLINE_USERS.some((user)=> (user.socketId === socketId && user.role === 'mortimer'));
  return isMortimerDisconnected;
};