import { Server, Socket } from "socket.io";

module.exports = (io: Server, socket: Socket) => {

  socket.on("Web-UserTest", async () => {
    socket.emit("Web-UserTest", 'User for Web');
  });
}
