import { mobileUserHandlers } from './listeners/mobileHandlers/user.ts';
import { webUserHandlers } from './listeners/webHandlers/user.ts';
import { globalHandlers } from './listeners/globalHandlers.ts';
export const socketHandlers = (io, socket) => {
    //Sockets used for BOTH parties: WEB & MOBILE
    globalHandlers(io, socket);
    //Sockets used for MOBILE
    mobileUserHandlers(io, socket);
    //Sockets used for WEB
    webUserHandlers(io, socket);
};
