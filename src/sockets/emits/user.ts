import { Server, Socket } from "socket.io";
import { ONLINE_USERS, webSocketId } from "../../game";
import { Player } from "../../interfaces/Player";

//sends an array with the connected users to web client on user connection
export const sendConnectedUsersArray = (io: Server):void => {
    console.log('Emitting connectedUsers socket message with online user list to everyone.')
    io.emit("connectedUsers", ONLINE_USERS);
}

// Sends tho the web that tha actual turn player selected to attack
export const sendAttackSelectedToWeb = (io: Server):void => {

    io.emit("web-selectAttack");
}

// Sends tho the web that tha actual turn player selected to heal
export const sendHealSelectedToWeb = (io: Server):void => {
    io.emit("web-selectHeal");
}

// Sends tho the web that tha actual turn player selected to heal
export const sendCurseSelectedToWeb = (io: Server):void => {
    io.emit("web-selectCurse");
}

// Sends tho the web that tha actual turn player selected to use a potion
export const sendUsePotionSelectedToWeb = (io: Server):void => {
    io.emit("web-selectUsePotion");
}

// Sends the player data to server
export const sendUserDataToWeb = (io: Server, player:Player):void => {
    console.log(`Emitting web-sendUser socket message with ${player.name}'s player data to web.`)
    io.to(webSocketId).emit("web-sendUser", player);
}