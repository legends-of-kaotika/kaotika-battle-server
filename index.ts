import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { socketHandlers } from './src/sockets/handlers.ts';
import { connectDatabase } from './src/db/connection.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const configuredOrigins = process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()).filter(Boolean);
const corsOrigin = configuredOrigins?.length ? configuredOrigins : '*';
const corsCredentials = corsOrigin !== '*';

app.use(cors({ origin: corsOrigin, credentials: corsCredentials }));
app.use(bodyParser.json());
app.get('/health', (_request, response): void => {
  response.status(200).json({ status: 'OK' });
});

const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    methods: ['GET', 'POST'],
    credentials: corsCredentials,
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
      console.error(`Error starting the server: ${(error as Error).message}`);
      process.exitCode = 1;
    }
  }
}

start();
