import { Server, Socket } from 'socket.io';
import { io } from '../../index.ts';
import { MOBILE } from '../constants/constants.ts';
import { ONLINE_USERS, currentPlayer, increaseTurn, resetInitialGameValues, setCurrentPlayer, turn } from '../game.ts';
import { DividedPlayers } from '../interfaces/DividedPlayers.ts';
import { Player } from '../interfaces/Player.ts';
import { assignTurn, sendGameEnd, sendPlayerDisconnectedToWeb, sendPlayerRemoved } from '../sockets/emits/user.ts';
import { clearTimer, startTimer } from '../timer/timer.ts';

//returns a player searched by id
export const findPlayerById = (_id: string): Player | undefined => {
  const user = ONLINE_USERS.find((player) => player._id === _id);
  return user;
};

//returns a player searched by socketid
export const findPlayerBySocketId = (id: string): Player | undefined => {  
  const user = ONLINE_USERS.find((player) => player.socketId === id);
  return user;
};

//inserts socketId in the specific player of playerConnected[] global variable
export const insertSocketId = (email: string, socketId: string): Player | undefined => {
  const user = ONLINE_USERS.find((user) => user.email === email);
  if (user) {
    user.socketId = socketId;
    return user;
  }
  return undefined;
};

//removes the player that got disconnected from playerConnected[] global variable
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

//returns a player searched by email
export const findPlayerByEmail = (email: string): Player | undefined => {
  const user = ONLINE_USERS.find((player) => player.email === email);
  return user;
};

//returns a boolean if a player is connected. searched by email
export const isPlayerConnected = (email: string): boolean => {
  return ONLINE_USERS.some((player) => (player.email === email));
};

//returns a object of loyals and betrayers
export const returnLoyalsAndBetrayers = (users:Player[]): DividedPlayers => {
  const obj: DividedPlayers = {
    kaotika: [],
    dravocar: [],
  };
  users.forEach(player => {
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
  assignTurn(io, currentPlayer!);
  clearTimer();
  startTimer();
};

// Check if there are at least 1 player from each side
export const eachSideHasPlayers = (io: Server, users: Player[]): boolean => {
  let gameHasPlayers: boolean = true;
  const dividedPlayers: DividedPlayers = returnLoyalsAndBetrayers(users);
  if ((dividedPlayers.dravocar.length === 0) && (dividedPlayers.kaotika.length === 0)) {
    sendGameEnd(io, 'draw');
    resetInitialGameValues();
    gameHasPlayers = false;
  } else if (dividedPlayers.dravocar.length === 0) {
    sendGameEnd(io, 'kaotika');
    resetInitialGameValues();
    gameHasPlayers = false;
  } else if (dividedPlayers.kaotika.length === 0) {
    sendGameEnd(io, 'dravocar');
    resetInitialGameValues();
    gameHasPlayers = false;
  }
  clearTimer();
  return gameHasPlayers;
};

//check if there is the minimum 1 player connected and of role acolyte no betrayer
export const checkStartGameRequirement = () => {
  if (ONLINE_USERS.length >= 1) {
    return ONLINE_USERS.some((user)=> (user.role === 'acolyte' && user.isBetrayer === false));
  }
  return false;
};

//returns an array of players sorted by their charisma
export const sortPlayersByCharisma = (players: Player[]): Player[] => {
  //sort characters by charisma
  players.sort((c1, c2) =>
    c1.attributes.charisma < c2.attributes.charisma
      ? 1
      : c1.attributes.charisma > c2.attributes.charisma
        ? -1
        : 0);
  return players;
};

// Prints a console.log() unless the code is being executed in testing enviroment 
export const logUnlessTesting = (message: string) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(message);
  }
};
