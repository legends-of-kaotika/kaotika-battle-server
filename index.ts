import { Socket } from "socket.io";

const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const { startCronJob } = require("./src/cron/cron.ts");

const dotenv = require('dotenv');
dotenv.config();  // Load environment variables from .env file 

const { createServer } = require("http");
const { Server } = require("socket.io");
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",  // Allows all origins, for testing purposes
        methods: ["GET", "POST"]
    }
});

//Handlers requires
const userHandlers = require('./src/sockets/user')

const onConnection = (socket: Socket): void => {
    console.log(socket.id, " joined the server.")

    //ADD SOCKET HANDLERS HERE
    userHandlers(io, socket)
}

async function start() {
    try {

        server.listen(PORT, () => {
            console.log(`Socket is listening on port ${PORT}`);
            io.on("connection", onConnection);

        });
        startCronJob();
    }
    catch (error) {
        console.log(`Error starting the server: ${error.message}`);
    }
}

start();