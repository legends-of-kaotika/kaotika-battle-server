"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setWebSocket = exports.webSocketId = exports.ONLINE_USERS = void 0;
exports.ONLINE_USERS = [];
exports.webSocketId = '';
//changes the websocketId
const setWebSocket = (socketId) => {
    exports.webSocketId = socketId;
};
exports.setWebSocket = setWebSocket;
