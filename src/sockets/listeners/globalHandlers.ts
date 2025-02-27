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

    // If the disconnected player is the current attacker, change turn.
    // if (player && player._id === currentPlayer?._id) {
    //   sendTurnTimeout();
    //   await sleep(1000);
    //   changeTurn();
    // }

    // Clear all the listeners
    socket.removeAllListeners();
  });

};
