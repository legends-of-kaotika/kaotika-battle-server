import { Socket } from 'socket.io';
import { io } from '../..';
import { MOBILE } from '../constants/constants';
import { ONLINE_USERS, currentPlayer, increaseTurn, setCurrentPlayer, turn } from '../game';
import { DividedPlayers } from '../interfaces/DividedPlayers';
import { Player } from '../interfaces/Player';
import { assignTurn, sendPlayerDisconnectedToWeb, sendPlayerRemoved } from '../sockets/emits/user';
import { clearTimer, startTimer } from '../timer/timer';

//returns a player searched by id
export const findPlayerById = (_id: string): Player | undefined => {
  const user = ONLINE_USERS.find((player)=> player._id === _id);
  return user;
};

//returns a player searched by socketid
export const findPlayerBySocketId = (id: string): Player | undefined => {
  const user = ONLINE_USERS.find((player)=> player.socketId === id);
  return user;
};

//inserts socketId in the specific player of playerConnected[] global variable
export const insertSocketId = (email: string, socketId: string): Player | undefined => {
  const user = ONLINE_USERS.find((user)=> user.email === email);
  if (user) {
    user.socketId = socketId;
    return user;
  }
  return undefined;
};

//removes the player that got disconnected from playerConnected[] global variable
export const removePlayerConnected = (socket: Socket, socketId: string): void => {  
  const userIndex = ONLINE_USERS.findIndex((user)=> user.socketId === socketId);
  if (userIndex != -1) {    
    console.log('Player with email',ONLINE_USERS[userIndex].email, 'and socket', ONLINE_USERS[userIndex].socketId ,'disconnected');
    socket.leave(MOBILE);
    sendPlayerRemoved(io,ONLINE_USERS[userIndex]);
    sendPlayerDisconnectedToWeb(io,ONLINE_USERS[userIndex].name);
    ONLINE_USERS.splice(userIndex, 1);
  } else {
    console.log('No players found with the received socket');
  }
};

//returns a player searched by email
export const findPlayerByEmail = (email: string): Player | undefined => {
  const user = ONLINE_USERS.find((player)=> player.email === email);
  return user;
};

//returns a boolean if a player is connected. searched by email
export const returnIfPlayerIsConnected = (email: string): boolean => {
  return ONLINE_USERS.some((player) => (player.email === email));
};

//returns a object of loyals and betrayers
export const returnLoyalsAndBetrayers = (): DividedPlayers => {
  const obj: DividedPlayers = {
    kaotika: [],
    dravocar: [],
  };
  ONLINE_USERS.map( player => {
    if (player.isBetrayer) {
      obj.dravocar.push(player);
    } else {
      obj.kaotika.push(player);
    }
  });  
  return obj;
};

//changes the turn players
export const changeTurn = () => {
  increaseTurn();
  const nextPlayer = ONLINE_USERS[turn];
  setCurrentPlayer(nextPlayer);
  assignTurn(io,currentPlayer!);
  clearTimer();
  startTimer();
};

//check if there is the minimum 1 player connected and of role acolyte
export const checkStartGameRequirement = () => {
  if (ONLINE_USERS.length >= 1) {
    return ONLINE_USERS.some((user)=> (user.role === 'acolyte'));
  }
  return false;
};

