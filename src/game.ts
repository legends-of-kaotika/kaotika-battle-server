import { io } from '../index.ts';
import { nextRoundStartFirst } from './helpers/game.ts';
import { getPlayersTurnSuccesses, sortTurnPlayers } from './helpers/turn.ts';
import { Player } from './interfaces/Player.ts';
import { sendCurrentRound } from './sockets/emits/game.ts';

export const ONLINE_USERS: Player[] = [];
export let webSocketId: string = '';

export let target: Player | undefined;
export let currentPlayer: Player | undefined;
export let turn: number = 0;
export let round: number = 1;
export let isGameStarted: boolean = false;
export let idPlayerFirstTurn: string | null = null;

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
  sendCurrentRound(io,round);
  // Sort players by successes, charisma, dexterity
  const playersTurnSuccesses = getPlayersTurnSuccesses(ONLINE_USERS);
  sortTurnPlayers(playersTurnSuccesses, ONLINE_USERS);
  // Sort player if got luck
  if (idPlayerFirstTurn) {
    nextRoundStartFirst(idPlayerFirstTurn, ONLINE_USERS);
    // Reset player first by luck
    idPlayerFirstTurn = null;
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
  turn = 0;
  round = 1;
  // Empty the players array
  while (ONLINE_USERS.length > 0) {
    ONLINE_USERS.pop();
  };
};

export const setPlayerFirstTurnId =  (id: string | null) : void => {
  idPlayerFirstTurn = id;
};