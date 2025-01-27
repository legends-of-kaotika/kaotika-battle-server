import { Server, Socket } from "socket.io";
import { sendConnectedUsersArrayToWeb } from "../../emits/user";
import { ONLINE_USERS } from "../../../game";

module.exports = (io: Server, socket: Socket) => {
  socket.on("Web-UserTest", async () => {
    socket.emit("Web-UserTest", "User for Web");
  });
  socket.on("Web-send-dudes", async () => {
    sendConnectedUsersArrayToWeb(io, socket);
  });
  socket.on('disconnect', async () => {
    console.log(ONLINE_USERS);
    
    for (let i = 0; i < ONLINE_USERS.length; i++) {
      if (ONLINE_USERS[i].socketId === socket.id) {
        console.log('Player with email',ONLINE_USERS[i].email, 'and socket', socket.id ,'disconnected');
        ONLINE_USERS.splice(i,1);
      }
    }
    console.log(ONLINE_USERS);
    sendConnectedUsersArrayToWeb(io,socket)
  })
};
