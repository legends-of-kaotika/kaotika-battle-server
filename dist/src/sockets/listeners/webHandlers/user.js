"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../../emits/user");
const game_1 = require("../../../game");
const constants_1 = require("../../../constants/constants");
module.exports = (io, socket) => {
    //gets web client socketId
    socket.on(constants_1.WEB_SEND_SOCKET_ID, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('web-sendSocketId socket message listened. Getting web-client socket and saving it in webSocketId Variable.');
        (0, game_1.setWebSocket)(socket.id);
        console.log(game_1.webSocketId);
    }));
    //sends current online players
    socket.on(constants_1.WEB_SEND_USERS, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('web-sendUsers socket message listened. Sending Online Users to everyone.');
        (0, user_1.sendConnectedUsersArrayToWeb)(io);
    }));
};
