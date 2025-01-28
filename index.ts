import { Socket } from "socket.io";
import { ONLINE_USERS } from "./src/game";
const mongoose = require('mongoose');

const express = require('express')
const bodyParser = require("body-parser"); 
const app = express()
const PORT = process.env.PORT || 3000
const router = require("./src/routes/routes");
const playerService = require("./src/controllers/playerController");
const dotenv = require('dotenv');
dotenv.config();  // Load environment variables from .env file 

//Mongo route 
const mongodbRoute = process.env.MONGO_URI;

const { createServer } = require("http");
const { Server } = require("socket.io");
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",  // Allows all origins, for testing purposes
    methods: ["GET", "POST"],
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
  }
});

app.use(bodyParser.json());
app.use("/api/player", router);

//Handlers requires
const webHandlers = require('./src/sockets/WebHandlers')
const mobileHandlers = require('./src/sockets/MobileHandlers')

const onConnection = (socket: Socket): void => {  
  console.log(socket.id, " joined the server.")
  
  webHandlers(io, socket)
  mobileHandlers(io, socket)
}

async function start() {
  try {

    server.listen(PORT, () => {
      console.log(`Socket is listening on port ${PORT}`);
      io.on("connection", onConnection);
    });

    // Connect to mongoose
    await mongoose.connect(mongodbRoute, {});
    console.log('Conexion con Mongo correcta');

  }
  catch (error) {
    console.log(`Error starting the server: ${error.message}`);
  }
}

start();