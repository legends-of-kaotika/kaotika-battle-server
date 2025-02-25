import { WEB_CURRENT_ROUND, WEB_SEND_SELECTED_BATTLE, WEB_TURN_TIMEOUT } from '../../constants/sockets.ts';
import { webSocketId } from '../../game.ts';
import { logUnlessTesting } from '../../helpers/utils.ts';
import { io } from '../../../index.ts';

export const sendCurrentRound = (round: number) : void => {
  logUnlessTesting(`sending emit with the round ${round} number`);
  io.to(webSocketId).emit(WEB_CURRENT_ROUND, round);
};

export const sendTurnTimeout = () => {
  logUnlessTesting('sending turn timeout emit to web');
  io.to(webSocketId).emit(WEB_TURN_TIMEOUT);
};

export const sendCurrentSelectedBattle = (_id:string) => {
  logUnlessTesting('sending selected battle emit to web');
  io.to(webSocketId).emit(WEB_SEND_SELECTED_BATTLE, _id);
};