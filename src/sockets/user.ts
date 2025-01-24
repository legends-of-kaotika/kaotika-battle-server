
import { Server, Socket } from "socket.io";

module.exports = (io:Server, socket:Socket) => {

    socket.on("test", async () => {
        socket.emit("test", 'Hello World');
    });
}
