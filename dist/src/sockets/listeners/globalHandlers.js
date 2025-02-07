var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { removePlayerConnected } from '../../helpers/helper.ts';
import { DISCONNECT } from '../../constants/constants.ts';
export const globalHandlers = (io, socket) => {
    //sends the new array of players on disconnect
    socket.on(DISCONNECT, () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('disconnect socket message listened. Deleting user from online users list.');
        console.log('trying to remove player with the following socket: ', socket.id);
        removePlayerConnected(socket, socket.id);
    }));
};
