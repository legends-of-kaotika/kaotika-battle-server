import { Server, Socket } from 'socket.io';
import { removePlayerConnected } from '../../helpers/player.ts';
import { DISCONNECT } from '../../constants/sockets.ts';

export const globalHandlers = (io: Server, socket: Socket): void => { 
  //sends the new array of players on disconnect
  socket.on(DISCONNECT, async () => {
    console.log('disconnect socket message listened. Deleting user from online users list.');
    console.log('trying to remove player with the following socket: ', socket.id);
    removePlayerConnected(socket, socket.id);
  });
};
