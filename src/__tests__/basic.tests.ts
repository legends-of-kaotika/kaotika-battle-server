/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from 'socket.io';
import { createServer } from 'http';
import Client from 'socket.io-client';
import { Socket } from 'socket.io';
import { DividedPlayers } from '../interfaces/DividedPlayers';
import { CONNECTED_USERS, WEB_SEND_USER, WEB_SET_SELECTED_PLAYER } from '../constants/constants';
import { sendConnectedUsersArrayToAll, sendConnectedUsersArrayToWeb, sendSelectedPlayerIdToWeb, sendUserDataToWeb } from '../sockets/emits/user';
import { ONLINE_USERS_MOCK, playerMock } from '../__mocks__/players';
import { Player } from '../interfaces/Player';

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

  describe('Global Emit tests', () => {
    test('should send an array with the connected users to all clients on gameStart', () => {
      clientSocket.on(CONNECTED_USERS, (arg:DividedPlayers) => {
        expect(arg.dravocar[0].name).toEqual(ONLINE_USERS_MOCK[0].name);
      });
      sendConnectedUsersArrayToAll(io, ONLINE_USERS_MOCK);
    });
  });
  describe('Mobile Emit tests', () => {
  });
  describe('Web Emit tests', () => {
    test('should send an array with the connected users to web client on user connection', () => {
      clientSocket.on(CONNECTED_USERS, (arg:DividedPlayers) => {
        expect(arg.dravocar[0].name).toEqual(ONLINE_USERS_MOCK[0].name);
      });
      sendConnectedUsersArrayToWeb(io, ONLINE_USERS_MOCK);
    });
    test('should send an _id of a player', () => {
      clientSocket.on(WEB_SET_SELECTED_PLAYER, (arg:string) => {
        expect(arg).toEqual(playerMock._id); // expect an id
      });
      sendSelectedPlayerIdToWeb(io, playerMock);
    });
    test('should send a player', () => {
      clientSocket.on(WEB_SEND_USER, (arg:Player) => {
        expect(arg._id).toEqual(playerMock._id); // expect a player, check ids
      });
      sendUserDataToWeb(io, playerMock);
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