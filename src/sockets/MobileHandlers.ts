import { Server, Socket } from "socket.io";

const userHandlers = require("./mobileHandlers/user");
module.exports = (io: Server, socket: Socket) => {
  userHandlers(io, socket);
}