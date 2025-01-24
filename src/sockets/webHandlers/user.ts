import { Server, Socket } from "socket.io";

module.exports = (io: Server, socket: Socket) => {

  socket.on("Mobile-UserTest", async () => {
    socket.emit("Mobile-UserTest", 'User for Mobile');
  });
}
