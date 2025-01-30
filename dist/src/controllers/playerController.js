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
const game_1 = require("../game");
const helper_1 = require("../helpers/helper");
const playerService = require('../services/playerService');
const initFetchPlayer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { email } } = req;
    // Check if the parameter :email exist
    if (!email) {
        return res
            .status(400)
            .send({
            status: "FAILED",
            data: { error: "ERROR: Parameter :email cannot be empty" },
        });
    }
    try {
        const playerData = yield playerService.initFetchPlayer(email);
        if (!playerData) {
            return res.status(404).send({ message: "Does not exist any player with this email" });
        }
        // Return the player data
        if ((0, helper_1.returnIfPlayerIsConnected)(playerData.email)) {
            console.log(playerData.email, 'is already connected');
            res.send({ status: "OK", data: playerData });
        }
        else {
            game_1.ONLINE_USERS.push(playerData);
            res.send({ status: "OK", data: playerData });
        }
    }
    catch (error) {
        res
            .status((error === null || error === void 0 ? void 0 : error.status) || 500)
            .send({
            status: "FAILED",
            message: "ERROR while making the petition:",
            data: { error: (error === null || error === void 0 ? void 0 : error.message) || error }
        });
    }
});
module.exports = {
    initFetchPlayer,
};
