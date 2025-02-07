var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { isGameStarted, ONLINE_USERS } from '../game.ts';
import { isPlayerConnected } from '../helpers/helper.ts';
import { initFetchPlayer } from '../services/playerService.ts';
export const initFetchPlayerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { email } } = req;
    // Check if the parameter :email exist
    if (!email) {
        return res
            .status(400)
            .send({
            status: 'FAILED',
            data: { error: 'ERROR: Parameter :email cannot be empty' },
        });
    }
    // Check if game is already started
    if (isGameStarted) {
        return res
            .status(403)
            .send({
            status: 'FAILED',
            data: { error: 'Cannot join: Game is already in progress' },
        });
    }
    try {
        const playerData = yield initFetchPlayer(email);
        if (!playerData) {
            return res.status(404).send({ message: 'Does not exist any player with this email' });
        }
        // check if player is already connected
        if (isPlayerConnected(playerData.email)) {
            console.log(playerData.email, 'is already connected');
        }
        else {
            ONLINE_USERS.push(playerData);
        }
        // Return player data
        res
            .status(200)
            .send({ status: 'OK', data: playerData });
    }
    catch (error) {
        res
            .status((error === null || error === void 0 ? void 0 : error.status) || 500)
            .send({
            status: 'FAILED',
            message: 'ERROR while making the petition:',
            data: { error: (error === null || error === void 0 ? void 0 : error.message) || error }
        });
    }
});
