import { playersMock } from "./__mocks__/players";
import { Player } from "./interfaces/Player";

export let ONLINE_USERS: Player[] = []
export let webSocketId: string = '';

export let target: Player | undefined;
export let currentPlayer: Player | undefined;
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