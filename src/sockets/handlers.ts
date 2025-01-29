import { Server, Socket } from "socket.io";

const mobileUserHandlers = require("./listeners/mobileHandlers/user");
const webUserHandlers = require("./listeners/webHandlers/user");
const globalHandlers =  require('./listeners/globalHandlers')

module.exports = (io: Server, socket: Socket) => {
    //Sockets used for BOTH parties: WEB & MOBILE
    globalHandlers(io, socket);

    //Sockets used for MOBILE
    mobileUserHandlers(io, socket);

    //Sockets used for WEB
    webUserHandlers(io, socket);
}