import { Server, Socket } from 'socket.io';
import { removePlayerConnected } from '../../helpers/player.ts';
import { DISCONNECT } from '../../constants/sockets.ts';
import { RESET_GAME } from '../../constants/sockets.ts';
import { resetInitialGameValues } from '../../game.ts';
import { logUnlessTesting } from '../../helpers/utils.ts';

export const globalHandlers = (io: Server, socket: Socket): void => { 
  //sends the new array of players on disconnect
  socket.on(DISCONNECT, async () => {
    console.log(`disconnect socket message listened. Deleting user with socket: ${socket.id} from online users list.`);
    removePlayerConnected(socket, socket.id);
  });

  // reset game
  sendResetGame(socket);
};


const sendResetGame = (socket : Socket) : void => {
  socket.on(RESET_GAME, () => {
    resetInitialGameValues();
    logUnlessTesting(`sendign the emit ${RESET_GAME} to all`);
  });
};