import { Server } from 'socket.io';
import { io } from '../../index.ts';
import { ONLINE_USERS, currentPlayer, increaseTurn, resetInitialGameValues, setCurrentPlayer, turn } from '../game.ts';
import { DividedPlayers } from '../interfaces/DividedPlayers.ts';
import { Player } from '../interfaces/Player.ts';
import { assignTurn, sendGameEnd } from '../sockets/emits/user.ts';
import { clearTimer, startTimer } from '../timer/timer.ts';

// Returns a object of loyals and betrayers
export const returnLoyalsAndBetrayers = (users:Player[]): DividedPlayers => {
  const obj: DividedPlayers = {
    kaotika: [],
    dravocar: [],
  };
  users.forEach(player => {
    if (player.isBetrayer) {
      obj.dravocar.push(player);
    } else {
      obj.kaotika.push(player);
    }
  });
  return obj;
};

// Changes the turn players
export const changeTurn = () => {
  increaseTurn();
  const nextPlayer = ONLINE_USERS[turn];
  setCurrentPlayer(nextPlayer);
  assignTurn(io, currentPlayer!);
  clearTimer();
  startTimer();
};

// Check if there are at least 1 player from each side
export const eachSideHasPlayers = (io: Server, users: Player[]): boolean => {
  let gameHasPlayers: boolean = true;
  const dividedPlayers: DividedPlayers = returnLoyalsAndBetrayers(users);
  if ((dividedPlayers.dravocar.length === 0) && (dividedPlayers.kaotika.length === 0)) {
    sendGameEnd(io, 'draw');
    resetInitialGameValues();
    gameHasPlayers = false;
  } else if (dividedPlayers.dravocar.length === 0) {
    sendGameEnd(io, 'kaotika');
    resetInitialGameValues();
    gameHasPlayers = false;
  } else if (dividedPlayers.kaotika.length === 0) {
    sendGameEnd(io, 'dravocar');
    resetInitialGameValues();
    gameHasPlayers = false;
  }
  clearTimer();
  return gameHasPlayers;
};

// Check if there is the minimum 1 player connected and of role acolyte no betrayer
export const checkStartGameRequirement = () => {
  if (ONLINE_USERS.length >= 1) {
    return ONLINE_USERS.some((user)=> (user.role === 'acolyte' && user.isBetrayer === false));
  }
  return false;
};

export const nextRoundStartFirst = (player : Player, playersTurns: Player[]) : Player[] => {
  playersTurns.unshift(player);
  return playersTurns;
};

export const noDamageReceived = () : void => {
  
};


