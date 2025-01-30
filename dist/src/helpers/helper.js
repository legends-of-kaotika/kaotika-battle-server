"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnIfPlayerIsConnected = exports.findPlayerByEmail = exports.removePlayerConnected = exports.insertSocketId = exports.findPlayerBySocketId = exports.findPlayerById = void 0;
const game_1 = require("../game");
const constants_1 = require("../constants/constants");
//returns a player searched by id
const findPlayerById = (_id) => {
    for (let i = 0; i < game_1.ONLINE_USERS.length; i++) {
        if (game_1.ONLINE_USERS[i]._id === _id) {
            return game_1.ONLINE_USERS[i];
        }
    }
    return "No players found";
};
exports.findPlayerById = findPlayerById;
//returns a player searched by socketid
const findPlayerBySocketId = (id) => {
    for (let i = 0; i < game_1.ONLINE_USERS.length; i++) {
        if (game_1.ONLINE_USERS[i].socketId === id) {
            return game_1.ONLINE_USERS[i];
        }
    }
    return 'No players found';
};
exports.findPlayerBySocketId = findPlayerBySocketId;
//inserts socketId in the specific player of playerConnected[] global variable
const insertSocketId = (email, socketId) => {
    const user = game_1.ONLINE_USERS.find((user) => user.email === email);
    if (user) {
        user.socketId = socketId;
        return user;
    }
    return undefined;
};
exports.insertSocketId = insertSocketId;
//removes the player that got disconnected from playerConnected[] global variable
const removePlayerConnected = (socket, socketId) => {
    const userIndex = game_1.ONLINE_USERS.findIndex((user) => user.socketId === socketId);
    if (userIndex != -1) {
        console.log('Player with email', game_1.ONLINE_USERS[userIndex].email, 'and socket', game_1.ONLINE_USERS[userIndex].socketId, 'disconnected');
        socket.leave(constants_1.MOBILE);
        game_1.ONLINE_USERS.splice(userIndex, 1);
    }
};
exports.removePlayerConnected = removePlayerConnected;
//returns a player searched by email
const findPlayerByEmail = (email) => {
    for (let i = 0; i < game_1.ONLINE_USERS.length; i++) {
        if (game_1.ONLINE_USERS[i].email === email) {
            return game_1.ONLINE_USERS[i];
        }
    }
    return "No players found";
};
exports.findPlayerByEmail = findPlayerByEmail;
//returns a boolean if a player is connected. searched by email
const returnIfPlayerIsConnected = (email) => {
    for (let i = 0; i < game_1.ONLINE_USERS.length; i++) {
        if (game_1.ONLINE_USERS[i].email === email) {
            return true;
        }
    }
    return false;
};
exports.returnIfPlayerIsConnected = returnIfPlayerIsConnected;
