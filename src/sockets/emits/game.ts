import { Server } from 'socket.io';
import { WEB_CURRENT_ROUND } from '../../constants/sockets.ts';
import { webSocketId } from '../../game.ts';
import { logUnlessTesting } from '../../helpers/utils.ts';


export const sendCurrentRound = (io: Server, round: number) : void => {
  logUnlessTesting(`sending emit with the round ${round} number`);
  io.to(webSocketId).emit(WEB_CURRENT_ROUND, round);
};
