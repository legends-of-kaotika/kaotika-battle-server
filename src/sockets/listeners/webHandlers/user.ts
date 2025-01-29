import { Server, Socket } from "socket.io";
import { sendConnectedUsersArray } from "../../emits/user";
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
    sendConnectedUsersArray(io);
  });

  //sends the new array of players on disconnect
  socket.on(DISCONNECT, async () => {
    console.log('disconnect socket message listened. Deleting user from online users list.')
    console.log('trying to remove player with the following socket: ', socket.id)
    removePlayerConnected(socket.id);
    sendConnectedUsersArray(io)
  })
};
