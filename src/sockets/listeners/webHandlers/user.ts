import { Server, Socket } from 'socket.io';
import { sendConnectedUsersArrayToWeb } from '../../emits/user.ts';
import { ONLINE_USERS, setWebSocket, webSocketId } from '../../../game.ts';
import { changeTurn, eachSideHasPlayers } from '../../../helpers/game.ts';
import { WEB_SEND_SOCKET_ID, WEB_SEND_USERS, WEB_TURN_END } from '../../../constants/sockets.ts';

export const webUserHandlers = (io: Server, socket: Socket): void => { 

  //gets web client socketId
  socket.on(WEB_SEND_SOCKET_ID, async () => {
    console.log('web-sendSocketId socket message listened. Getting web-client socket and saving it in webSocketId Variable.');
    setWebSocket(socket.id);
    console.log(webSocketId);
  });

  //sends current online players
  socket.on(WEB_SEND_USERS, async () => {
    console.log('web-sendUsers socket message listened. Sending Online Users to everyone.');
    sendConnectedUsersArrayToWeb(io, ONLINE_USERS);
  });

  // When the turn ends
  socket.on(WEB_TURN_END, async () => {
    console.log('web-turnEnd socket message listened. Check if the game has to end.');
    if (eachSideHasPlayers(io, ONLINE_USERS)) {
      console.log('Changing to the next turn.');
      changeTurn();
    }
  });
};
