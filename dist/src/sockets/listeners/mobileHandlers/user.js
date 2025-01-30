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
const helper_1 = require("../../../helpers/helper");
const constants_1 = require("../../../constants/constants");
const timer_1 = require("../../../timer/timer");
module.exports = (io, socket) => {
    //receive socketId + email from clientMobile
    socket.on(constants_1.MOBILE_SEND_SOCKET_ID, (email) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`new player with socketId: ${socket.id} ${email}`);
        const newPlayerConnected = (0, helper_1.insertSocketId)(email, socket.id);
        if (newPlayerConnected) {
            socket.join(constants_1.MOBILE);
            (0, user_1.sendUserDataToWeb)(io, newPlayerConnected);
        }
    }));
    // When Mortimer presses the START Button
    socket.on(constants_1.MOBILE_GAME_START, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('mobile-gameStart socket message listened. Sending Online users to everyone.');
        (0, user_1.sendConnectedUsersArrayToAll)(io);
    }));
    // When a player selects that is going to make an attack
    socket.on(constants_1.MOBILE_SELECT_ATTACK, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('mobile-selectAttack socket message listened. Performing attack.');
        (0, user_1.sendAttackSelectedToWeb)(io);
    }));
    // When a player selects that is going to heal
    socket.on(constants_1.MOBILE_SELECT_HEAL, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('mobile-selectHeal socket message listened. Performing heal.');
        (0, user_1.sendHealSelectedToWeb)(io);
    }));
    // When a player selects that is going to curse
    socket.on(constants_1.MOBILE_SELECT_CURSE, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('mobile-selectCurse socket message listened. Performing curse.');
        (0, user_1.sendCurseSelectedToWeb)(io);
    }));
    // When a player selects that is going to use a potion
    socket.on(constants_1.MOBILE_SELECT_USE_POTION, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('mobile-selectUsePotion socket message listened. Using potion.');
        (0, user_1.sendUsePotionSelectedToWeb)(io);
    }));
    socket.on(constants_1.MOBILE_ATTACK, (_id) => __awaiter(void 0, void 0, void 0, function* () {
        let defender = (0, helper_1.findPlayerById)(_id);
        let attacker = (0, helper_1.findPlayerBySocketId)(socket.id);
        //calculate damage
        let totalDmg = 0;
        //return players to web
        (0, user_1.sendConnectedUsersArrayToAll)(io);
    }));
    socket.on(constants_1.TURN_START, () => __awaiter(void 0, void 0, void 0, function* () {
        (0, timer_1.startTimer)();
    }));
};
