import { Server, Socket } from "socket.io";
import { sendConnectedUsersArray } from "../../emits/user";

module.exports = (io: Server, socket: Socket) => {

  socket.on("Mobile-UserTest", async () => {
    socket.emit("Mobile-UserTest", 'User for Mobile');
  });

  socket.on('Mobile-GameStart', async () => {
    sendConnectedUsersArray(io)
  })
}
