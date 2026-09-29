import { nextRoundStartFirst } from './helpers/game.ts';
import { getPlayersTurnSuccesses, sortTurnPlayers } from './helpers/turn.ts';
import { Battle } from './interfaces/Battles.ts';
import { Player } from './interfaces/Player.ts';
import { sendCurrentRound } from './sockets/emits/game.ts';
import { sendConnectedUsersArrayToWeb } from './sockets/emits/user.ts';
import { clearTimer, resetTimer } from './timer/timer.ts';
import { io } from '../index.ts';
import * as SOCKETS from './constants/sockets.ts';
import { logUnlessTesting } from './helpers/utils.ts';
import { clearDisconnectGraceTimers } from './sockets/reconnect.ts';

export const GAME_USERS: Player[] = [];
export const CONNECTED_USERS: Player[] = [];
export const NPCS: Player[] = [];
export const KILLED_PLAYERS: Player[] = [];
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
export let gameGeneration = 0;
export let turnGeneration = 0;
let turnAdvanceClaimed = false;
let pendingAction: { turnGeneration: number; targetId: string } | null = null;
let endingGeneration: number | null = null;
let actionTimeout: NodeJS.Timeout | undefined;

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

export const beginTurn = (): number => {
  turnGeneration++;
  turnAdvanceClaimed = false;
  pendingAction = null;
  return turnGeneration;
};

export const claimTurnAdvance = (expectedTurnGeneration: number): boolean => {
  if (expectedTurnGeneration !== turnGeneration || turnAdvanceClaimed) return false;
  turnAdvanceClaimed = true;
  return true;
};

export const beginAction = (targetId: string): boolean => {
  if (pendingAction || turnAdvanceClaimed) return false;
  pendingAction = { turnGeneration, targetId };
  return true;
};

export const updatePendingActionTarget = (targetId: string): void => {
  if (pendingAction) pendingAction.targetId = targetId;
};

export const scheduleActionFallback = (callback: () => void, delay: number): void => {
  if (actionTimeout) clearTimeout(actionTimeout);
  actionTimeout = setTimeout(callback, delay);
  actionTimeout.unref();
};

export const claimActionCompletion = (targetId: string): number | null => {
  if (!pendingAction || pendingAction.targetId !== targetId) return null;
  const actionTurn = pendingAction.turnGeneration;
  pendingAction = null;
  if (actionTimeout) clearTimeout(actionTimeout);
  actionTimeout = undefined;
  return claimTurnAdvance(actionTurn) ? actionTurn : null;
};

export const cancelPendingAction = (): void => {
  pendingAction = null;
  if (actionTimeout) clearTimeout(actionTimeout);
  actionTimeout = undefined;
};

export const getPendingActionTargetId = (): string | null => pendingAction?.targetId ?? null;

export const beginGameEnd = (generation: number): boolean => {
  if (generation !== gameGeneration || endingGeneration === generation) return false;
  endingGeneration = generation;
  return true;
};

export const isGameEnding = (): boolean => endingGeneration === gameGeneration;

export const isAttackPending = (): boolean => pendingAction !== null;

//changes the turn number
export const increaseTurn = (): void => {
  turn++;
  if (turn >= (GAME_USERS.length)) { // if last player turn, follow with the first player of the array
    turn = 0;
    increaseRound();
  }
};

export const adjustTurnForRemovedIndex = (removedIndex: number): void => {
  if (removedIndex <= turn) turn--;
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

  console.log('Resetting game');

  isGameStarted = false;
  gameGeneration++;
  turnGeneration++;
  turnAdvanceClaimed = false;
  pendingAction = null;
  if (actionTimeout) clearTimeout(actionTimeout);
  actionTimeout = undefined;
  endingGeneration = null;
  target = undefined;
  currentPlayer = undefined;
  turn = -1;
  round = 1;
  setIsGameCreated(false);
  setSelectedBattleId(null);
  setIdPlayerFirstTurn(null);
  clearTimer();
  resetTimer();
  clearDisconnectGraceTimers();
  
  // Empty the players and NPC arrays
  while (GAME_USERS.length > 0) {
    GAME_USERS.pop();
  };
  while (NPCS.length > 0) {
    NPCS.pop();
  };
  while (KILLED_PLAYERS.length > 0) {
    KILLED_PLAYERS.pop();
  };
  // Send the new users array to web to display them.(instead of npc)
  sendConnectedUsersArrayToWeb(GAME_USERS);
 
  // Emit the game reset to all devices
  io.emit(SOCKETS.GAME_RESET, () => {
    logUnlessTesting(`sending the emit ${SOCKETS.GAME_RESET}`);
  });

  // Emit the game reset to mobile
  io.emit(SOCKETS.IS_GAME_CREATED, false);
  
  
};

export const setPlayerFirstTurnId =  (id: string | null) : void => {
  setIdPlayerFirstTurn(id);
};

export const setIsGameCreated = (status: boolean): void => {
  isGameCreated = status;
};
