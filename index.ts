import { Socket } from 'socket.io';
import express from 'express';
import bodyParser from 'body-parser';
import { socketHandlers } from './src/sockets/handlers.ts';
import router from './src/routes/routes.ts';
import dotenv from 'dotenv';
import {createServer} from 'http';
import {Server} from 'socket.io';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api/player', router);

dotenv.config();

// Load .env file (only for non-test environments)
if (process.env.NODE_ENV !== 'test') {
  dotenv.config(); // Load environment variables from .env file 
}

const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST'],
    credentials:true,           
    optionsSuccessStatus:200,
  }
});

const onConnection = (socket: Socket): void => {  
  console.log(socket.id, ' joined the server.');
  socketHandlers(io, socket);
};

async function start() {

  // Start server only if NOT in test mode
  if (process.env.NODE_ENV !== 'test') {
    try {
      server.listen(PORT, () => {
        console.log(`Socket is listening on port ${PORT}`);
        io.on('connection', onConnection);
      });
    } catch (error) {
      console.log(`Error starting the server: ${error.message}`);
    }
  }
}

start();