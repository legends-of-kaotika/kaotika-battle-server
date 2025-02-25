import { WEB_CURRENT_ROUND, WEB_TURN_TIMEOUT, IS_GAME_CREATED } from '../../constants/sockets.ts';
import { webSocketId } from '../../game.ts';
import { logUnlessTesting } from '../../helpers/utils.ts';
import { io } from '../../../index.ts';
import { isGameCreated } from '../../game.ts';
import * as SOCKETS from '../../constants/sockets.ts';
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
export const sendCreateBattleToWeb = (battle: Battle | undefined): void => {

  io.to(webSocketId).emit(SOCKETS.WEB_CREATE_BATTLE, battle);
  io.emit(SOCKETS.IS_GAME_CREATED, true);
};
export const sendBattlestoMobile = (battles: Battle[]): void => {
  io.to(SOCKETS.MOBILE).emit(SOCKETS.BATTLES, battles);
};