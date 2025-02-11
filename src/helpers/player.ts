import { Socket } from 'socket.io';
import { io } from '../../index.ts';
import { MOBILE } from '../constants/sockets.ts';
import { ONLINE_USERS } from '../game.ts';
import { Player } from '../interfaces/Player.ts';
import { sendPlayerDisconnectedToWeb, sendPlayerRemoved } from '../sockets/emits/user.ts';
import { Die2 } from '../constants/dies.ts';

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

// Returns an array of players sorted by their charisma
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

export const getTurnNumOfDieRolls = (playerCharisma: number , playerDexterity: number): number => {
  return Math.ceil((playerCharisma + playerDexterity / 2) / 20);
};

export const getPlayerTurnSuccesses = (turnNumOfDieRolls: number): number => {
  let numOfSuccesses = 0;
  for (let i = 0; i < turnNumOfDieRolls; ++i) {
    const rollResult = Die2.roll();
    if (rollResult === 2) {numOfSuccesses += 1;};
  }
  return numOfSuccesses;
};

// export const getPlayersWithTurnSuccesses = (players: Player[]): Record


// // FLUJO

// const playersTurnSuccesses = getPlayerTurnSuccesses();
// sortTurnPlayers(playersTurnSuccesses);


// ARCHIVO HELPERS

export const getPlayersTurnSuccesses = (onlineUsers: Player[]): Record<string, number> => {
  let outputObject = {};
  onlineUsers.forEach((player) => {
    const turnNumOfDieRolls = getTurnNumOfDieRolls(player.attributes.charisma, player.attributes.dexterity);
    const successTime = getPlayerTurnSuccesses(turnNumOfDieRolls);
    outputObject = { ...outputObject, [player._id]: successTime };
  });
  return outputObject;
};

// const sortTurnPlayers = (playersTurnSuccesses) => {

//   ONLINE_USERS.sort((a, b) => {

//     const player1Suceceses = playersTurnSuccesses[player1._id]; // 3
//     const player2Suceceses = playersTurnSuccesses[player2._id]; // 1

//     if (player1Suceceses !== player2Suceceses) {

//       // SORT BY SUCESS
//       return player2Suceceses - player1Suceceses;

//     } else {
//       // SORT BY CHARISMA & DEXTERITY

//       if (player1.attributes.charisma === player2.attributes.charisma) {
//         // SORT BY CHARISMA

//       } else {
//         // SORT BY DEXTERITY

//       }

//     }

//   });
// };