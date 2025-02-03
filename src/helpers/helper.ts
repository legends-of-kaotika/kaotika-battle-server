import { Socket } from 'socket.io';
import { ONLINE_USERS, currentPlayer, increaseTurn, setCurrentPlayer, turn } from '../game';
import { Player } from '../interfaces/Player';
import { MOBILE } from '../constants/constants';
import { DividedPlayers } from '../interfaces/DividedPlayers';
import { assingTurn } from '../sockets/emits/user';
import { io } from '../..';
import { clearTimer, startTimer } from '../timer/timer';

//returns a player searched by id
export const findPlayerById = (_id: string): Player | undefined => {
  ONLINE_USERS.map( player => {
    if (player._id === _id) {
      return player;
    } 
  });
  return undefined;
};

//returns a player searched by socketid
export const findPlayerBySocketId = (id: string): Player | undefined => {

  ONLINE_USERS.map( player => {
    if (player.socketId === id) {
      return player;
    } 
  });
  return undefined;
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
    ONLINE_USERS.splice(userIndex, 1);
  }
};

//returns a player searched by email
export const findPlayerByEmail = (email: string): Player | undefined => {
  ONLINE_USERS.map( player => {
    if (player.email === email) {
      return player;
    } 
  });
  return undefined;
};

//returns a boolean if a player is connected. searched by email
export const returnIfPlayerIsConnected = (email: string): boolean => {
  ONLINE_USERS.map( player => {
    if (player.email === email) {
      return true;
    } 
  });
  return false;
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
  console.log(obj);
  
  return obj;
};

//changes the turn players
export const changeTurn = () => {
  increaseTurn();
  const nextPlayer = ONLINE_USERS[turn];
  setCurrentPlayer(nextPlayer);
  assingTurn(io,currentPlayer!);
  clearTimer();
  startTimer();
};

