import { Server, Socket } from "socket.io";
import { sendConnectedUsersArray } from "../../emits/user";

module.exports = (io: Server, socket: Socket) => {
  socket.on("Web-UserTest", async () => {
    socket.emit("Web-UserTest", "User for Web");
  });
  socket.on("Web-sendUsers", async () => {
    sendConnectedUsersArray(io);
  });
};
