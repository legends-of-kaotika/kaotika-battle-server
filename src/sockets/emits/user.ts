import { Server, Socket } from "socket.io";
import { ONLINE_USERS } from "../../game";

//sends an array with the connected users to web client on user connection
export const sendConnectedUsersArray = (io: Server):void => {
    io.emit("connectedUsers", ONLINE_USERS);
}


// Sends tho the web that tha actual turn player selected to attack
export const sendAttackSelectedToWeb = (io: Server):void => {
    io.emit("web-attackSelected");
}

// Sends tho the web that tha actual turn player selected to heal
export const sendHealSelectedToWeb = (io: Server):void => {
    io.emit("web-healSelected");
}

// Sends tho the web that tha actual turn player selected to heal
export const sendCurseSelectedToWeb = (io: Server):void => {
    io.emit("web-curseSelected");
}

// Sends tho the web that tha actual turn player selected to use a potion
export const sendUsePotionSelectedToWeb = (io: Server):void => {
    io.emit("web-usePotionSelected");
}

