import { Server, Socket } from "socket.io";
import { sendConnectedUsersArray } from "../../emits/user";
import { ONLINE_USERS } from "../../../game";
import { removePlayerConnected } from "../../../helpers/helper";

module.exports = (io: Server, socket: Socket) => { 
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
