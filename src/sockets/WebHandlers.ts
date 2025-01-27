import { Server, Socket } from "socket.io";

const userHandlers = require("./webHandlers/user");

module.exports = (io: Server, socket: Socket) => {
  userHandlers(io,socket)
}