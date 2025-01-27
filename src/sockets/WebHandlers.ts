import { Server, Socket } from "socket.io";

const userHandlers = require("./listeners/webHandlers/user");

module.exports = (io: Server, socket: Socket) => {
  userHandlers(io,socket)
}