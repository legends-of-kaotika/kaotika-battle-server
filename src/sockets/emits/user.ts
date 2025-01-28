import { Server, Socket } from "socket.io";
import { ONLINE_USERS, webSocketId } from "../../game";
import { Player } from "../../interfaces/Player";
import { CONNECTED_USERS, WEB_SELECT_ATTACK, WEB_SELECT_CURSE, WEB_SELECT_HEAL, WEB_SELECT_USE_POTION, WEB_SEND_USER } from "../../constants/constants";

//sends an array with the connected users to web client on user connection
export const sendConnectedUsersArray = (io: Server):void => {
    console.log('Emitting connectedUsers socket message with online user list to everyone.')
    io.emit(CONNECTED_USERS, ONLINE_USERS);
}

// Sends tho the web that tha actual turn player selected to attack
export const sendAttackSelectedToWeb = (io: Server):void => {

    io.emit(WEB_SELECT_ATTACK);
}

// Sends tho the web that tha actual turn player selected to heal
export const sendHealSelectedToWeb = (io: Server):void => {
    io.emit(WEB_SELECT_HEAL);
}

// Sends tho the web that tha actual turn player selected to heal
export const sendCurseSelectedToWeb = (io: Server):void => {
    io.emit(WEB_SELECT_CURSE);
}

// Sends tho the web that tha actual turn player selected to use a potion
export const sendUsePotionSelectedToWeb = (io: Server):void => {
    io.emit(WEB_SELECT_USE_POTION);
}

// Sends the player data to server
export const sendUserDataToWeb = (io: Server, player:Player):void => {
    console.log(`Emitting web-sendUser socket message with ${player.name}'s player data to web.`)
    io.to(webSocketId).emit(WEB_SEND_USER, player);
}