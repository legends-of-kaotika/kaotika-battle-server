import { Server } from 'socket.io';
import { CURRENT_ROUND } from '../../constants/sockets.ts';
import { webSocketId } from '../../game.ts';
import { logUnlessTesting } from '../../helpers/utils.ts';


export const sendCurrenRound = (io: Server, round: number) : void => {
  logUnlessTesting(`sendind emit with the round ${round} number`);
  io.to(webSocketId).emit(CURRENT_ROUND, round);
};
