var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { assignTurn, gameStartToAll, sendConnectedUsersArrayToAll, sendCurseSelectedToWeb, sendHealSelectedToWeb, sendSelectedPlayerIdToWeb, sendUsePotionSelectedToWeb, sendUserDataToWeb, sendNotEnoughPlayers } from '../../emits/user.ts';
import { checkStartGameRequirement, findPlayerById, insertSocketId, sortPlayersByCharisma } from '../../../helpers/helper.ts';
import * as SOCKETS from '../../../constants/constants.ts';
import { startTimer } from '../../../timer/timer.ts';
import { ONLINE_USERS, currentPlayer, round, setCurrentPlayer, setGameStarted, setTarget, target, turn, } from '../../../game.ts';
export const mobileUserHandlers = (io, socket) => {
    // Receive socketId + email from clientMobile
    socket.on(SOCKETS.MOBILE_SEND_SOCKET_ID, (email) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`new player with socketId: ${socket.id} ${email}`);
        const newPlayerConnected = insertSocketId(email, socket.id);
        if (newPlayerConnected) {
            socket.join(SOCKETS.MOBILE);
            sendUserDataToWeb(io, newPlayerConnected);
        }
    }));
    // When Mortimer presses the START Button
    socket.on(SOCKETS.MOBILE_GAME_START, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`Socket ${SOCKETS.MOBILE_GAME_START} received`);
        //Check if there at least 1 acolyte no betrayer connected (enemy always there is one as a bot)
        if (checkStartGameRequirement() === false) {
            console.log('Not minimum 1 acolyte no betrayer connected, can\'t start game');
            sendNotEnoughPlayers(io, socket.id);
        }
        else {
            console.log('mobile-gameStart socket message listened. Sending Online users to everyone.');
            // Set game as started
            setGameStarted(true);
            //sort players by charisma
            sortPlayersByCharisma(ONLINE_USERS);
            //assign the first player
            console.log('Round: ', round);
            setCurrentPlayer(ONLINE_USERS[turn]);
            //divide players by loyalty
            sendConnectedUsersArrayToAll(io, ONLINE_USERS);
            //emit first turn player id
            assignTurn(io, currentPlayer);
            gameStartToAll(io);
            startTimer();
        }
    }));
    // When the current turn player selects a player
    socket.on(SOCKETS.MOBILE_SET_SELECTED_PLAYER, (_id) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`Socket ${SOCKETS.MOBILE_SET_SELECTED_PLAYER} received`);
        const newTarget = findPlayerById(_id);
        console.log('newTarget: ', newTarget === null || newTarget === void 0 ? void 0 : newTarget.nickname);
        if (!newTarget) {
            console.error('Selected player not found');
            return;
        }
        if (newTarget._id !== _id) {
            console.error('Target ID mismatch in selection');
            return;
        }
        setTarget(newTarget);
        sendSelectedPlayerIdToWeb(io, target);
    }));
    // When a player selects that is going to heal
    socket.on(SOCKETS.MOBILE_SELECT_HEAL, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`${SOCKETS.MOBILE_SELECT_HEAL} socket message listened. Performing heal.`);
        sendHealSelectedToWeb(io);
    }));
    // When a player selects that is going to curse
    socket.on(SOCKETS.MOBILE_SELECT_CURSE, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`${SOCKETS.MOBILE_SELECT_CURSE} socket message listened. Performing curse.`);
        sendCurseSelectedToWeb(io);
    }));
    // When a player selects that is going to use a potion
    socket.on(SOCKETS.MOBILE_SELECT_USE_POTION, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`${SOCKETS.MOBILE_SELECT_USE_POTION} socket message listened. Using potion.`);
        sendUsePotionSelectedToWeb(io);
    }));
    socket.on(SOCKETS.MOBILE_ATTACK, (_id) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`${SOCKETS.MOBILE_ATTACK} socket message listened.`);
        // Ensure that there's a target selected
        if (!target) {
            console.error('No target has been selected');
            return;
        }
        // Attack the selected target vía their ID
        console.log('Attacking the player: ', target === null || target === void 0 ? void 0 : target.nickname);
        if (target._id !== _id) {
            console.error(`Attack target mismatch. Expected: ${target._id}, Received: ${_id}`);
            return;
        }
        // Define the current attacker, and ensure there's one
        const attacker = currentPlayer;
        console.log('Target being attacked by the player: ', attacker === null || attacker === void 0 ? void 0 : attacker.nickname);
        if (!attacker) {
            console.error('Attacker not found');
            return;
        }
        if (!target || !attacker) {
            console.error('Either attacker or target not found');
            return;
        }
        //Emits the attack results to mobile clients
        // sendUpdatedPlayerToAll(io, target._id, target.attributes, totalDmg, target.isBetrayer);
    }));
};
