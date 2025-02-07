import { webSocketId } from '../../game.ts';
import * as SOCKETS from '../../constants/constants.ts';
import { returnLoyalsAndBetrayers } from '../../helpers/helper.ts';
//sends an array with the connected users to web client on user connection
export const sendConnectedUsersArrayToWeb = (io, users) => {
    console.log(`Emitting ${SOCKETS.CONNECTED_USERS} socket message with online user list to everyone.`);
    const dividedPlayers = returnLoyalsAndBetrayers(users);
    io.to(webSocketId).emit(SOCKETS.CONNECTED_USERS, dividedPlayers);
};
export const sendConnectedUsersArrayToAll = (io, users) => {
    console.log('Emitting connectedUsers socket message with online user list to everyone.');
    const dividedPlayers = returnLoyalsAndBetrayers(users);
    io.emit(SOCKETS.CONNECTED_USERS, dividedPlayers);
};
// Sends tho the web that tha actual turn player has selected a player
export const sendSelectedPlayerIdToWeb = (io, player) => {
    if (player) {
        console.log(`Emitting ${SOCKETS.WEB_SET_SELECTED_PLAYER} socket with player id.`);
        io.to(webSocketId).emit(SOCKETS.WEB_SET_SELECTED_PLAYER, player._id);
    }
};
// Sends tho the web that tha actual turn player selected to heal
export const sendHealSelectedToWeb = (io) => {
    console.log(`Emitting ${SOCKETS.WEB_SELECT_HEAL} socket to web.`);
    io.to(webSocketId).emit(SOCKETS.WEB_SELECT_HEAL);
};
// Sends tho the web that tha actual turn player selected to heal
export const sendCurseSelectedToWeb = (io) => {
    console.log(`Emitting ${SOCKETS.WEB_SELECT_CURSE} socket to web.`);
    io.to(webSocketId).emit(SOCKETS.WEB_SELECT_CURSE);
};
// Sends tho the web that tha actual turn player selected to use a potion
export const sendUsePotionSelectedToWeb = (io) => {
    console.log(`Emitting ${SOCKETS.WEB_SELECT_USE_POTION} socket to web.`);
    io.to(webSocketId).emit(SOCKETS.WEB_SELECT_USE_POTION);
};
// Sends the player data to server
export const sendUserDataToWeb = (io, player) => {
    console.log(`Emitting ${SOCKETS.WEB_SEND_USER} socket to web with ${player.name}'s player data.`);
    io.to(webSocketId).emit(SOCKETS.WEB_SEND_USER, player);
};
// Sends the player data to server
export const sendTimerDataToAll = (io, timer) => {
    console.log(`Emitting ${SOCKETS.SEND_TIMER} socket message with turn time: ${timer} to all clients.`);
    io.emit(SOCKETS.SEND_TIMER, timer);
};
// Sends the player data to server
export const assignTurn = (io, player) => {
    console.log(`Emitting ${SOCKETS.ASSIGN_TURN} socket message with ${player.name}'s id to all devices to change turn.`);
    io.emit(SOCKETS.ASSIGN_TURN, player._id);
};
export const gameStartToAll = (io) => {
    console.log(`Emitting ${SOCKETS.GAME_START} socket message to all devices.`);
    io.emit(SOCKETS.GAME_START);
};
// Sends the target players(id) with the attributes updated and the total damage
export const sendUpdatedPlayerToAll = (io, id, updatedAttributes, totalDamage, isBetrayer) => {
    console.log(`Emitting ${SOCKETS.UPDATE_PLAYER} socket message with ${id} id, the total damage, updated attributes and isBetrayer`);
    io.emit(SOCKETS.UPDATE_PLAYER, { _id: id, attributes: updatedAttributes, totalDamage: totalDamage, isBetrayer: isBetrayer });
};
// Sends the players(id) that has been disconnected
export const sendPlayerRemoved = (io, player) => {
    console.log(`Emitting ${SOCKETS.REMOVE_PLAYER} socket message with ${player._id} id`);
    io.emit(SOCKETS.REMOVE_PLAYER, player._id);
};
// Send the game has ended and a string with the name of the winnner faction 
export const sendGameEnd = (io, winner) => {
    console.log(`Emitting ${SOCKETS.GAME_END} socket message to all devices, winner: ${winner}`);
    io.emit(SOCKETS.GAME_END, winner);
};
// Send to Mortimer that there is not enough players
export const sendNotEnoughPlayers = (io, socketId) => {
    console.log(`Emitting ${SOCKETS.NOT_ENOUGH_PLAYERS} to socketId ${socketId} that there is not enough players to start the game`);
    io.to(socketId).emit(SOCKETS.NOT_ENOUGH_PLAYERS);
};
//Sends the name of the player that has been disconnected to web
export const sendPlayerDisconnectedToWeb = (io, name) => {
    console.log(`Emitting ${SOCKETS.WEB_USER_DISCONNECT} to Web that ${name} player has been disconnected from battle`);
    io.to(webSocketId).emit(SOCKETS.WEB_USER_DISCONNECT, name);
};
