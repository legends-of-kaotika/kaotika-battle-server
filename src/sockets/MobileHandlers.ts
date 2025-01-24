import { Server, Socket } from "socket.io";

module.exports = (io: Server, socket: Socket) => {

  socket.on("Mobile-test", async () => {
    socket.emit("Mobile-test", 'Salutations');
  });
}