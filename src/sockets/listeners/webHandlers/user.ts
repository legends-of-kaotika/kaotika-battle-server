import { Server, Socket } from "socket.io";
import { sendConnectedUsersArray } from "../../emits/user";
import { ONLINE_USERS } from "../../../game";

module.exports = (io: Server, socket: Socket) => {
  socket.on("web-UserTest", async () => {
    socket.emit("web-UserTest", "user for Web");
  });
  socket.on("web-sendUsers", async () => {
    sendConnectedUsersArray(io);
  });

  //sends current online players
  socket.on("Web-sendUsers", async () => {
    sendConnectedUsersArray(io);
  });

  //sends the new array of players on disconnect
  socket.on('disconnect', async () => {
    console.log(ONLINE_USERS);
    
    for (let i = 0; i < ONLINE_USERS.length; i++) {
      if (ONLINE_USERS[i].socketId === socket.id) {
        console.log('Player with email',ONLINE_USERS[i].email, 'and socket', socket.id ,'disconnected');
        ONLINE_USERS.splice(i,1);
      }
    }
    console.log(ONLINE_USERS);
    sendConnectedUsersArray(io)
  })
};
