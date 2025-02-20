import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import router from './src/routes/routes.ts';
import { fetchNPCs } from './src/helpers/npc.ts';
import { socketHandlers } from './src/sockets/handlers.ts';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api/player', router);

// Load .env file
dotenv.config();

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
    
      await fetchNPCs();
    
    } catch (error) {
      console.log(`Error starting the server: ${error.message}`);
    }
  }
}

start();