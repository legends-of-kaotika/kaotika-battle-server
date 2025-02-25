import { io } from '../index.ts';
import { nextRoundStartFirst } from './helpers/game.ts';
import { getPlayersTurnSuccesses, sortTurnPlayers } from './helpers/turn.ts';
import { Battle } from './interfaces/Battles.ts';
import { Player } from './interfaces/Player.ts';
import { sendCurrentRound } from './sockets/emits/game.ts';
import { sendConnectedUsersArrayToWeb } from './sockets/emits/user.ts';
import { clearTimer } from './timer/timer.ts';

export const ONLINE_USERS: Player[] = [];
export const NPCS: Player[] = [];
export const BATTLES: Battle[] = [];
export let webSocketId: string = '';

export let target: Player | undefined;
export let currentPlayer: Player | undefined;
export let turn: number = -1;
export let round: number = 1;
export let isGameStarted: boolean = false;
export let idPlayerFirstTurn: string | null = null;
export let isGameCreated: boolean = false; 

export const setIdPlayerFirstTurn = (playerId: string | null): void => {
  idPlayerFirstTurn = playerId;
};

//changes the websocketId
export const setWebSocket = (socketId: string): void => {
  webSocketId = socketId;
};

//changes the websocketId
export const setTarget = (player: Player): void => {
  target = player;
};

//changes the websocketId
export const setCurrentPlayer = (player: Player): void => {
  currentPlayer = player;
};

//changes the turn number
export const increaseTurn = (): void => {
  turn++;
  if (turn >= (ONLINE_USERS.length)) { // if last player turn, follow with the first player of the array
    turn = 0;
    increaseRound();
  }
};

//changes the turn number
export const increaseRound = (): void => {
  round++;
  console.log('Round: ', round, ' Fight!');
  sendCurrentRound(round);
  // Sort players by successes, charisma, dexterity
  const playersTurnSuccesses = getPlayersTurnSuccesses(ONLINE_USERS);
  sortTurnPlayers(playersTurnSuccesses, ONLINE_USERS);
  // Sort player if got luck
  if (idPlayerFirstTurn) {
    nextRoundStartFirst(idPlayerFirstTurn, ONLINE_USERS);
    // Reset player first by luck
    setIdPlayerFirstTurn(null);
  }
};

// Sets the game state
export const setGameStarted = (status: boolean): void => {
  isGameStarted = status;
};

// Resets the values to the initals
export const resetInitialGameValues = (): void => {

  isGameStarted = false;
  target = undefined;
  currentPlayer = undefined;
  turn = -1;
  round = 1;
  setIdPlayerFirstTurn(null);
  clearTimer();
  
  // Empty the players array
  while (ONLINE_USERS.length > 0) {
    ONLINE_USERS.pop();
  };

  // Insert the NPCS data into ONLINE_USERS.
  ONLINE_USERS.push(...NPCS);

  // Send the new users array to web to display them.
  sendConnectedUsersArrayToWeb(io, ONLINE_USERS);

};

export const setPlayerFirstTurnId =  (id: string | null) : void => {
  setIdPlayerFirstTurn(id);
};

export const setIsGameCreated = (status: boolean): void => {
  isGameCreated = status;
};