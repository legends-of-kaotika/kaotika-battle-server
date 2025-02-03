import { Socket } from 'socket.io';
import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
const app = express();
const PORT = process.env.PORT || 3000;
// const playerService = require("./src/controllers/playerController");
import router from './src/routes/routes';
import dotenv from 'dotenv';
dotenv.config();  // Load environment variables from .env file 

//Mongo route 
const mongodbRoute = process.env.MONGO_URI;

import {createServer} from 'http';
import {Server} from 'socket.io';
const server = createServer(app);
import cors from 'cors';
export const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST'],
    credentials:true,           
    optionsSuccessStatus:200,
  }
});

app.use(cors());

app.use(bodyParser.json());
app.use('/api/player', router);

import { socketHandlers } from './src/sockets/handlers';

const onConnection = (socket: Socket): void => {  
  console.log(socket.id, ' joined the server.');
  socketHandlers(io, socket);
};

async function start() {
  try {

    server.listen(PORT, () => {
      console.log(`Socket is listening on port ${PORT}`);
      io.on('connection', onConnection);
    });

    // Connect to mongoose
    if(mongodbRoute) {
      await mongoose.connect(mongodbRoute, {});
      console.log('Conexion con Mongo correcta');
    }

  }
  catch (error) {
    console.log(`Error starting the server: ${error.message}`);
  }
}

start();