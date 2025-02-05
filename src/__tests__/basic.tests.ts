/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from 'socket.io';
import { createServer } from 'http';
import Client from 'socket.io-client';
import { Socket } from 'socket.io';
import { DividedPlayers } from '../interfaces/DividedPlayers';
import { CONNECTED_USERS } from '../constants/constants';
import { sendConnectedUsersArrayToAll, sendConnectedUsersArrayToWeb } from '../sockets/emits/user';
import { ONLINE_USERS_MOCK } from '../__mocks__/players';

describe('Socket.IO server tests', () => {
  let io: Server;
  let serverSocket: Socket;
  let clientSocket: any;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = (httpServer.address() as any).port;
      clientSocket = Client(`http://localhost:${port}`);
      io.on('connection', (socket) => {
        serverSocket = socket;
      });
      clientSocket.on('connect', done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test('should communicate', () => {
    clientSocket.on('test', (arg: string) => {
      expect(arg).toBe('hello world');
    });
    serverSocket.emit('test', 'hello world');
  });

  describe('Emit tests', () => {
    test('should send an array with the connected users to all clients on gameStart', () => {
      clientSocket.on(CONNECTED_USERS, (arg:DividedPlayers) => {
        expect(arg.dravocar[0].name).toEqual(ONLINE_USERS_MOCK[0].name);
      });
      sendConnectedUsersArrayToAll(io, ONLINE_USERS_MOCK);
    });
    test('should send an array with the connected users to web client on user connection', () => {
      clientSocket.on(CONNECTED_USERS, (arg:DividedPlayers) => {
        expect(arg.dravocar[0].name).toEqual(ONLINE_USERS_MOCK[0].name);
      });
      sendConnectedUsersArrayToWeb(io, ONLINE_USERS_MOCK);
    });
    
  });

  describe('Mobile listener tests', () => {
    test('should send an array with the connected users to all clients on gameStart', () => {
      clientSocket.on(CONNECTED_USERS, (arg:DividedPlayers) => {
        expect(arg.dravocar[0].name).toEqual(ONLINE_USERS_MOCK[0].name);
      });
      sendConnectedUsersArrayToAll(io, ONLINE_USERS_MOCK);
    });
    test('should send an array with the connected users to web client on user connection', () => {
      clientSocket.on(CONNECTED_USERS, (arg:DividedPlayers) => {
        expect(arg.dravocar[0].name).toEqual(ONLINE_USERS_MOCK[0].name);
      });
      sendConnectedUsersArrayToWeb(io, ONLINE_USERS_MOCK);
    });
    
  });
});