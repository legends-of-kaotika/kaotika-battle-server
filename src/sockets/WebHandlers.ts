import { Server, Socket } from "socket.io";

module.exports = (io: Server, socket: Socket) => {

  socket.on("Web-test", async () => {
    socket.emit("Web-test", 'Aloha');
  });
}