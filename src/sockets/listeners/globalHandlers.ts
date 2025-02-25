import { Server, Socket } from 'socket.io';
import { DISCONNECT } from '../../constants/sockets.ts';
import { removePlayerConnected } from '../../helpers/player.ts';
import { isGameStarted } from '../../game.ts';
import { eachSideHasPlayers } from '../../helpers/game.ts';

export const globalHandlers = (io: Server, socket: Socket): void => { 

  socket.on(DISCONNECT, async () => {
    
    console.log(`Disconnect socket message listened. Deleting user with socket: ${socket.id} from online users list.`);
    
    // Remove from connected users.
    removePlayerConnected(socket);

    // Check if any team wins.
    if (isGameStarted) { 
      eachSideHasPlayers();
    }

    // Clear all the listeners
    socket.removeAllListeners();
  });

};
