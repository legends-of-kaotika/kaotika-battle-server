import { Server, Socket } from "socket.io";

module.exports = (io: Server, socket: Socket) => {

  const userHandlers = require("./webHandlers/user");

  socket.on("Web-test", async () => {
    socket.emit("Web-test", 'Aloha');
  });
}