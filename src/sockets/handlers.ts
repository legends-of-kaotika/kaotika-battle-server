import { Server, Socket } from "socket.io";

import { mobileUserHandlers } from "./listeners/mobileHandlers/user";
import { webUserHandlers } from "./listeners/webHandlers/user";
import { globalHandlers } from "./listeners/globalHandlers";

export const socketHandlers = (io: Server, socket: Socket): void => {
    //Sockets used for BOTH parties: WEB & MOBILE
    globalHandlers(io, socket);

    //Sockets used for MOBILE
    mobileUserHandlers(io, socket);

    //Sockets used for WEB
    webUserHandlers(io, socket);
}