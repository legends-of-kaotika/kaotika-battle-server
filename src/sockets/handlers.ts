import { Server, Socket } from 'socket.io';

import { globalHandlers } from './listeners/globalHandlers.ts';
import { mobileUserHandlers } from './listeners/mobileHandlers/user.ts';
import { webUserHandlers } from './listeners/webHandlers/user.ts';

export const socketHandlers = (io: Server, socket: Socket): void => {
  //Sockets used for BOTH parties: WEB & MOBILE
  globalHandlers(socket);

  //Sockets used for MOBILE
  mobileUserHandlers(io, socket);

  //Sockets used for WEB
  webUserHandlers(io, socket);
};