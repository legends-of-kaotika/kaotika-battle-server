import { Server, Socket } from "socket.io";
import { sendConnectedUsersArrayToWeb } from "../../emits/user";
import { ONLINE_USERS, setWebSocket, webSocketId } from "../../../game";
import { removePlayerConnected } from "../../../helpers/helper";
import { DISCONNECT, WEB_SEND_SOCKET_ID, WEB_SEND_USERS } from "../../../constants/constants";

module.exports = (io: Server, socket: Socket) => { 

  //gets web client socketId
  socket.on(WEB_SEND_SOCKET_ID, async () => {
    console.log('web-sendSocketId socket message listened. Getting web-client socket and saving it in webSocketId Variable.')
    setWebSocket(socket.id);
    console.log(webSocketId);
  });

  //sends current online players
  socket.on(WEB_SEND_USERS, async () => {
    console.log('web-sendUsers socket message listened. Sending Online Users to everyone.')
    sendConnectedUsersArrayToWeb(io);
  });
};
