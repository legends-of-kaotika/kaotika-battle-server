var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { sendConnectedUsersArrayToWeb } from '../../emits/user.ts';
import { ONLINE_USERS, setWebSocket, webSocketId } from '../../../game.ts';
import { changeTurn, eachSideHasPlayers } from '../../../helpers/helper.ts';
import { WEB_SEND_SOCKET_ID, WEB_SEND_USERS, WEB_TURN_END } from '../../../constants/constants.ts';
export const webUserHandlers = (io, socket) => {
    //gets web client socketId
    socket.on(WEB_SEND_SOCKET_ID, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('web-sendSocketId socket message listened. Getting web-client socket and saving it in webSocketId Variable.');
        setWebSocket(socket.id);
        console.log(webSocketId);
    }));
    //sends current online players
    socket.on(WEB_SEND_USERS, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('web-sendUsers socket message listened. Sending Online Users to everyone.');
        sendConnectedUsersArrayToWeb(io, ONLINE_USERS);
    }));
    // When the turn ends
    socket.on(WEB_TURN_END, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('web-turnEnd socket message listened. Check if the game has to end.');
        if (eachSideHasPlayers(io, ONLINE_USERS)) {
            console.log('Changing to the next turn.');
            changeTurn();
        }
    }));
};
