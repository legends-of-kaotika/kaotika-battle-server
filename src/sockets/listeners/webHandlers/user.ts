import { Server, Socket } from "socket.io";
import { sendConnectedUsersArray } from "../../emits/user";
import { ONLINE_USERS } from "../../../game";

module.exports = (io: Server, socket: Socket) => { 
  //sends current online players
  socket.on("web-sendUsers", async () => {
    console.log('web-sendUsers socket message listened. Sending Online Users to everyone.')
    sendConnectedUsersArray(io);
  });

  //sends the new array of players on disconnect
  socket.on('disconnect', async () => {
    console.log('disconnect socket message listened. Deleting user from online users list.')
    
    for (let i = 0; i < ONLINE_USERS.length; i++) {
      if (ONLINE_USERS[i].socketId === socket.id) {
        console.log('Player with email',ONLINE_USERS[i].email, 'and socket', socket.id ,'disconnected');
        ONLINE_USERS.splice(i,1);
      }
    }
    sendConnectedUsersArray(io)
  })
};
