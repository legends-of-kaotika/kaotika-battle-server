import { Server, Socket } from "socket.io";
import { ONLINE_USERS } from "../../game";

//sends an array with the connected users to web client on user connection
export const sendConnectedUsersArrayToWeb = (io: Server, socket: Socket):void => {
    socket.emit("connected-users", ONLINE_USERS);
}

