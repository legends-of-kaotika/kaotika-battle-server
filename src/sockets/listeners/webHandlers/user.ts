import { Server, Socket } from "socket.io";
import { sendConnectedUsersArray } from "../../emits/user";
import { ONLINE_USERS, setWebSocket, webSocketId } from "../../../game";
import { removePlayerConnected } from "../../../helpers/helper";

module.exports = (io: Server, socket: Socket) => { 

  //gets web client socketId
  socket.on("web-sendSocketId", async () => {
    console.log('web-sendSocketId socket message listened. Getting web-client socket and saving it in webSocketId Variable.')
    setWebSocket(socket.id);
    console.log(webSocketId);
  });

  //sends current online players
  socket.on("web-sendUsers", async () => {
    console.log('web-sendUsers socket message listened. Sending Online Users to everyone.')
    sendConnectedUsersArray(io);
  });

  //sends the new array of players on disconnect
  socket.on('disconnect', async () => {
    console.log('disconnect socket message listened. Deleting user from online users list.')
    console.log('trying to remove player with the following socket: ', socket.id)
    removePlayerConnected(socket.id);
    sendConnectedUsersArray(io)
  })
};
