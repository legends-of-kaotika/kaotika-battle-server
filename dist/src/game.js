import { ONLINE_USERS_MOCK } from './__mocks__/players.ts';
export const ONLINE_USERS = [ONLINE_USERS_MOCK[0]];
export let webSocketId = '';
export let target;
export let currentPlayer;
export let turn = 0;
export let round = 1;
export let isGameStarted = false;
//changes the websocketId
export const setWebSocket = (socketId) => {
    webSocketId = socketId;
};
//changes the websocketId
export const setTarget = (player) => {
    target = player;
};
//changes the websocketId
export const setCurrentPlayer = (player) => {
    currentPlayer = player;
};
//changes the turn number
export const increaseTurn = () => {
    turn++;
    if (turn === (ONLINE_USERS.length)) { // if last player turn, follow with the first player of the array
        turn = 0;
        increaseRound();
    }
};
//changes the turn number
export const increaseRound = () => {
    round++;
    console.log('Round: ', round, ' Fight!');
};
// Sets the game state
export const setGameStarted = (status) => {
    isGameStarted = status;
};
// Resets the values to the initals
export const resetInitialGameValues = () => {
    isGameStarted = false;
    target = undefined;
    currentPlayer = undefined;
    turn = 0;
    round = 1;
    // Empty the players array
    while (ONLINE_USERS.length > 0) {
        ONLINE_USERS.pop();
    }
    ;
};
