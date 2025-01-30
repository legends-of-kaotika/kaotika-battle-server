"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTimerDataToAll = exports.sendUserDataToWeb = exports.sendUsePotionSelectedToWeb = exports.sendCurseSelectedToWeb = exports.sendHealSelectedToWeb = exports.sendAttackSelectedToWeb = exports.sendConnectedUsersArrayToAll = exports.sendConnectedUsersArrayToWeb = void 0;
const game_1 = require("../../game");
const constants_1 = require("../../constants/constants");
//sends an array with the connected users to web client on user connection
const sendConnectedUsersArrayToWeb = (io) => {
    console.log('Emitting connectedUsers socket message with online user list to everyone.');
    io.to(game_1.webSocketId).emit(constants_1.CONNECTED_USERS, game_1.ONLINE_USERS);
};
exports.sendConnectedUsersArrayToWeb = sendConnectedUsersArrayToWeb;
const sendConnectedUsersArrayToAll = (io) => {
    console.log('Emitting connectedUsers socket message with online user list to everyone.');
    io.emit(constants_1.CONNECTED_USERS, game_1.ONLINE_USERS);
};
exports.sendConnectedUsersArrayToAll = sendConnectedUsersArrayToAll;
// Sends tho the web that tha actual turn player selected to attack
const sendAttackSelectedToWeb = (io) => {
    io.to(game_1.webSocketId).emit(constants_1.WEB_SELECT_ATTACK);
};
exports.sendAttackSelectedToWeb = sendAttackSelectedToWeb;
// Sends tho the web that tha actual turn player selected to heal
const sendHealSelectedToWeb = (io) => {
    io.to(game_1.webSocketId).emit(constants_1.WEB_SELECT_HEAL);
};
exports.sendHealSelectedToWeb = sendHealSelectedToWeb;
// Sends tho the web that tha actual turn player selected to heal
const sendCurseSelectedToWeb = (io) => {
    io.to(game_1.webSocketId).emit(constants_1.WEB_SELECT_CURSE);
};
exports.sendCurseSelectedToWeb = sendCurseSelectedToWeb;
// Sends tho the web that tha actual turn player selected to use a potion
const sendUsePotionSelectedToWeb = (io) => {
    io.to(game_1.webSocketId).emit(constants_1.WEB_SELECT_USE_POTION);
};
exports.sendUsePotionSelectedToWeb = sendUsePotionSelectedToWeb;
// Sends the player data to server
const sendUserDataToWeb = (io, player) => {
    console.log(`Emitting web-sendUser socket message with ${player.name}'s player data to web.`);
    io.to(game_1.webSocketId).emit(constants_1.WEB_SEND_USER, player);
};
exports.sendUserDataToWeb = sendUserDataToWeb;
// Sends the player data to server
const sendTimerDataToAll = (io, timer) => {
    console.log(`Emitting send-timer socket message with turn time: ${timer} to all clients.`);
    io.emit(constants_1.SEND_TIMER, timer);
};
exports.sendTimerDataToAll = sendTimerDataToAll;
