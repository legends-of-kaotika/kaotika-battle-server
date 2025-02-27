import { nextRoundStartFirst } from './helpers/game.ts';
import { getPlayersTurnSuccesses, sortTurnPlayers } from './helpers/turn.ts';
import { Battle } from './interfaces/Battles.ts';
import { Player } from './interfaces/Player.ts';
import { sendCurrentRound } from './sockets/emits/game.ts';
import { sendConnectedUsersArrayToWeb } from './sockets/emits/user.ts';
import { clearTimer } from './timer/timer.ts';

export const GAME_USERS: Player[] = [];
export const CONNECTED_USERS: Player[] = [];
export const NPCS: Player[] = [];
export const BATTLES: Battle[] = [];
export let webSocketId: string = '';

export let target: Player | undefined;
export let currentPlayer: Player | undefined;
export let turn: number = -1;
export let round: number = 1;
export let isGameStarted: boolean = false;
export let idPlayerFirstTurn: string | null = null;
export let selectedBattleId: string | null = null;
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
  if (turn >= (GAME_USERS.length)) { // if last player turn, follow with the first player of the array
    turn = 0;
    increaseRound();
  }
};

export const setSelectedBattleId = (_id:string | null):void => {
  selectedBattleId = _id;
};

//changes the turn number
export const increaseRound = (): void => {
  round++;
  console.log('Round: ', round, ' Fight!');
  sendCurrentRound(round);
  // Sort players by successes, charisma, dexterity
  const playersTurnSuccesses = getPlayersTurnSuccesses(GAME_USERS);
  sortTurnPlayers(playersTurnSuccesses, GAME_USERS);
  // Sort player if got luck
  if (idPlayerFirstTurn) {
    nextRoundStartFirst(idPlayerFirstTurn, GAME_USERS);
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
  setIsGameCreated(false);
  setSelectedBattleId(null);
  setIdPlayerFirstTurn(null);
  clearTimer();
  
  // Empty the players array
  while (GAME_USERS.length > 0) {
    GAME_USERS.pop();
  };

  // Send the new users array to web to display them.
  sendConnectedUsersArrayToWeb(GAME_USERS);
};

export const setPlayerFirstTurnId =  (id: string | null) : void => {
  setIdPlayerFirstTurn(id);
};

export const setIsGameCreated = (status: boolean): void => {
  isGameCreated = status;
};
