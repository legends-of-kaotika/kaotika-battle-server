import { Player } from './interfaces/Player';

export const ONLINE_USERS: Player[] = [];
export let webSocketId: string = '';

export let target: Player | undefined;
export let currentPlayer: Player | undefined;
export let turn: number = 0;
export let round: number = 1;
export let isGameStarted: boolean = false;

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
  if (turn === (ONLINE_USERS.length)) { // if last player turn, follow with the first player of the array
    turn = 0;
    increaseRound();
  }
};

//changes the turn number
export const increaseRound = (): void => {
  round++;
  console.log('Round: ', round, ' Fight!');
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