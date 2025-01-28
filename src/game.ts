import { playersMock } from "./__mocks__/players";
import { Player } from "./interfaces/Player";

export let ONLINE_USERS: Player[] = []
export let webSocketId: string = '';


//changes the websocketId
export const setWebSocket = (socketId: string): void => {
    webSocketId = socketId;
  };