import { Server, Socket } from "socket.io";

module.exports = (io: Server, socket: Socket) => {

  const userHandlers = require("./mobileHandlers/user");

  socket.on("Mobile-test", async () => {
    socket.emit("Mobile-test", 'Salutations');
  });
}