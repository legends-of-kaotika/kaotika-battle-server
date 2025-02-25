import { Socket } from 'socket.io';
import { DISCONNECT } from '../../constants/sockets.ts';
import { isGameStarted } from '../../game.ts';
import { eachSideHasPlayers } from '../../helpers/game.ts';
import { removePlayerConnected } from '../../helpers/player.ts';

export const globalHandlers = (socket: Socket): void => { 
  //sends the new array of players on disconnect
  socket.on(DISCONNECT, async () => {
    console.log(`disconnect socket message listened. Deleting user with socket: ${socket.id} from online users list.`);
    removePlayerConnected(socket, socket.id);
    if (isGameStarted) { 
      eachSideHasPlayers();
    }
  });
};


