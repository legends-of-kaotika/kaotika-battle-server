import { Server, Socket } from "socket.io";
import { sendConnectedUsersArrayToAll } from "../emits/user";
import { removePlayerConnected } from "../../helpers/helper";
import { DISCONNECT } from "../../constants/constants";

export const globalHandlers = (io: Server, socket: Socket): void => { 
  //sends the new array of players on disconnect
  socket.on(DISCONNECT, async () => {
    console.log('disconnect socket message listened. Deleting user from online users list.')
    console.log('trying to remove player with the following socket: ', socket.id)
    removePlayerConnected(socket, socket.id);
    sendConnectedUsersArrayToAll(io)
  })
};
