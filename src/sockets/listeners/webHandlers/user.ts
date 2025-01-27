import { Server, Socket } from "socket.io";
import { sendConnectedUsersArray } from "../../emits/user";

module.exports = (io: Server, socket: Socket) => {
  socket.on("web-UserTest", async () => {
    socket.emit("web-UserTest", "user for Web");
  });
  socket.on("web-sendUsers", async () => {
    sendConnectedUsersArray(io);
  });
};
