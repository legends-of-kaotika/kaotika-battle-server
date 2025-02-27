import { io } from '../../../index.ts';
import * as SOCKETS from '../../constants/sockets.ts';
import { IS_GAME_CREATED, WEB_CURRENT_ROUND, WEB_SEND_SELECTED_BATTLE, WEB_TURN_TIMEOUT } from '../../constants/sockets.ts';
import { isGameCreated, selectedBattleId, webSocketId } from '../../game.ts';
import { findBattleById } from '../../helpers/battle.ts';
import { logUnlessTesting } from '../../helpers/utils.ts';
import { Battle } from '../../interfaces/Battles.ts';


export const sendCurrentRound = (round: number) : void => {
  logUnlessTesting(`sending emit with the round ${round} number`);
  io.to(webSocketId).emit(WEB_CURRENT_ROUND, round);
};

export const sendTurnTimeout = () => {
  logUnlessTesting('sending turn timeout emit to web');
  io.to(webSocketId).emit(WEB_TURN_TIMEOUT);
};

export const sendIsGameCreated = () : void => {
  logUnlessTesting(`emit the ${IS_GAME_CREATED} to all with isGameStarted: ${isGameCreated}`);
  io.emit(IS_GAME_CREATED, isGameCreated);
};

export const sendIsGameCreatedToEmiter = (socketId: string) : void => {
  logUnlessTesting(`emit the ${IS_GAME_CREATED} to all with isGameStarted: ${isGameCreated}`);
  io.to(socketId).emit(IS_GAME_CREATED, isGameCreated);
};

export const sendCreatedBattleToWeb = (battleData: Partial<Battle>): void => {
  io.to(webSocketId).emit(SOCKETS.WEB_CREATE_BATTLE, battleData);
};

export const sendSelectedBattleToWeb = () => {
  
  logUnlessTesting('sending selected battle emit to web');

  if (!selectedBattleId) {
    console.log('selectedBattleId variable doesnt have any value!.');
    return;
  }

  const battleData = findBattleById(selectedBattleId);

  // battleData?.enemies.forEach

  if (!battleData) {
    console.log(`No battle found with id ${selectedBattleId}`);
    return;
  }

  // const webBattleData = parseWebBattleData(battleData);
  io.to(webSocketId).emit(WEB_SEND_SELECTED_BATTLE, battleData);

};

