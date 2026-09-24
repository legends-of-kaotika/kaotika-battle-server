import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { socketHandlers } from './src/sockets/handlers.ts';
import { connectDatabase } from './src/db/connection.ts';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

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
  socketHandlers(socket);
};

// Starts the HTTP + Socket.IO server on the given port and registers the
// connection handler. Resolves with the actual port in use (useful when
// passing 0 to bind an ephemeral port in tests).
export const startServer = (port: number = Number(PORT)): Promise<number> => {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, () => {
      const address = server.address();
      const actualPort = typeof address === 'object' && address !== null ? address.port : port;
      console.log(`Socket is listening on port ${actualPort}`);
      io.on('connection', onConnection);
      resolve(actualPort);
    });
  });
};

async function start() {

  // Start server only if NOT in test mode
  if (process.env.NODE_ENV !== 'test') {
    try {
      await connectDatabase();
      await startServer(Number(PORT));
    } catch (error) {
      console.log(`Error starting the server: ${(error as Error).message}`);
    }
  }
}

start();