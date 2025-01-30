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
exports.io = void 0;
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;
const router = require("./src/routes/routes");
const playerService = require("./src/controllers/playerController");
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file 
//Mongo route 
const mongodbRoute = process.env.MONGO_URI;
const { createServer } = require("http");
const { Server } = require("socket.io");
const server = createServer(app);
const cors = require("cors");
exports.io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
        optionSuccessStatus: 200,
    }
});
app.use(cors());
app.use(bodyParser.json());
app.use("/api/player", router);
const socketHandlers = require('./src/sockets/handlers');
const onConnection = (socket) => {
    console.log(socket.id, " joined the server.");
    socketHandlers(exports.io, socket);
};
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            server.listen(PORT, () => {
                console.log(`Socket is listening on port ${PORT}`);
                exports.io.on("connection", onConnection);
            });
            // Connect to mongoose
            yield mongoose.connect(mongodbRoute, {});
            console.log('Conexion con Mongo correcta');
        }
        catch (error) {
            console.log(`Error starting the server: ${error.message}`);
        }
    });
}
start();
