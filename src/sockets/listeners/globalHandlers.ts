import { Socket } from 'socket.io';
import { DISCONNECT } from '../../constants/sockets.ts';
import { findPlayerBySocketId, removePlayerConnected } from '../../helpers/player.ts';
import { isGameStarted } from '../../game.ts';
import { eachSideHasPlayers } from '../../helpers/game.ts';

export const globalHandlers = (socket: Socket): void => { 

  socket.on(DISCONNECT, async () => {
    
    const player = findPlayerBySocketId(socket.id);
    console.log(`${player?.nickname || `Player with socket id ${socket.id}`} disconnected.`);
    
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
