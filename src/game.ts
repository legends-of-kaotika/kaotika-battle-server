import { playersMock } from "./__mocks__/players";
import { Player } from "./interfaces/Player";

export let ONLINE_USERS: Player[] = []
export let webSocketId: string = '';

export let target: Player | undefined;
export let currentPlayer: Player | undefined;
export let turn: number = 0;
export let round: number = 1;

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