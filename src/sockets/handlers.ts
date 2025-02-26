import { Socket } from 'socket.io';
import { globalHandlers } from './listeners/globalHandlers.ts';
import { mobileUserHandlers } from './listeners/mobileHandlers/user.ts';
import { webUserHandlers } from './listeners/webHandlers/user.ts';

export const socketHandlers = (socket: Socket): void => {
  //Sockets used for BOTH parties: WEB & MOBILE
  globalHandlers(socket);

  //Sockets used for MOBILE
  mobileUserHandlers(socket);

  //Sockets used for WEB
  webUserHandlers(socket);
};