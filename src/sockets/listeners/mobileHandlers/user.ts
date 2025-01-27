import { Server, Socket } from "socket.io";
import { sendConnectedUsersArray } from "../../emits/user";

module.exports = (io: Server, socket: Socket) => {

  socket.on("mobile-userTest", async () => {
    socket.emit("mobile-userTest", 'User for mobile');
  });

  socket.on('mobile-gameStart', async () => {
    sendConnectedUsersArray(io)
  })
}
