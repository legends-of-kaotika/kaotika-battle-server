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
const user_1 = require("../emits/user");
const helper_1 = require("../../helpers/helper");
const constants_1 = require("../../constants/constants");
module.exports = (io, socket) => {
    //sends the new array of players on disconnect
    socket.on(constants_1.DISCONNECT, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('disconnect socket message listened. Deleting user from online users list.');
        console.log('trying to remove player with the following socket: ', socket.id);
        (0, helper_1.removePlayerConnected)(socket, socket.id);
        (0, user_1.sendConnectedUsersArrayToAll)(io);
    }));
};
