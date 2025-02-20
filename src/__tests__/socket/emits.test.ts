/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import Client from 'socket.io-client';
import { ONLINE_USERS_MOCK, playerMock } from '../../__mocks__/players.ts';
import { ASSIGN_TURN, CONNECTED_USERS, GAME_START, SEND_TIMER, WEB_CURRENT_ROUND, WEB_SEND_USER, WEB_SET_SELECTED_PLAYER } from '../../constants/sockets.ts';
import { logUnlessTesting } from '../../helpers/utils.ts';
import { DividedPlayers } from '../../interfaces/DividedPlayers.ts';
import { Player } from '../../interfaces/Player.ts';
import { assignTurn, gameStartToAll, sendConnectedUsersArrayToAll, sendConnectedUsersArrayToWeb, sendSelectedPlayerIdToWeb, sendTimerDataToWeb, sendUserDataToWeb } from '../../sockets/emits/user.ts';
import { sendCurrentRound } from '../../sockets/emits/game.ts';

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

  afterAll((done) => {
    io.close(() => {
      logUnlessTesting('Closed Socket.IO server');
      done();
    });
  
    clientSocket.close();
    serverSocket.disconnect();
  });

  test('should communicate', (done) => {
    clientSocket.on('test', (arg: string) => {
      expect(arg).toBe('hello world');
      done();
    });
    serverSocket.emit('test', 'hello world');
  });

  describe('Global Emit tests', () => {
    test('should send an array with the connected users to all clients on gameStart', (done) => {
      clientSocket.on(CONNECTED_USERS, (arg:DividedPlayers) => {
        expect(arg.dravokar[0].name).toEqual(ONLINE_USERS_MOCK[0].name);
        done();
      });
      sendConnectedUsersArrayToAll(io, ONLINE_USERS_MOCK);
    });
    test('should send a number', (done) => {
      const timer = 10;
      clientSocket.on(SEND_TIMER, (arg:number) => {
        expect(arg).toEqual(timer); // expect a number
        done();
      });
      sendTimerDataToWeb(io, timer);
    });
    test('should send the _id of the player that has been assigned', (done) => {
      clientSocket.on(ASSIGN_TURN, (arg:string) => {
        expect(arg).toEqual(playerMock._id); // expect an id of a player
        done();
      });
      assignTurn(io, playerMock);
    });
    test('should send the message game start to all devices', (done) => {
      clientSocket.on(GAME_START, () => {
        expect(true).toBe(true); // expect the socket to have been called
        done();
      });
      gameStartToAll(io);
    });
  });
  describe('Web Emit tests', () => {
    test('should send an array with the connected users to web client on user connection', () => {
      clientSocket.on(CONNECTED_USERS, (arg:DividedPlayers) => {
        expect(arg.dravokar[0].name).toEqual(ONLINE_USERS_MOCK[0].name);
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
    test('should send a player', () => {
      clientSocket.on(WEB_SEND_USER, (arg:Player) => {
        expect(arg._id).toEqual(playerMock._id); // expect a player, check ids
      });
      sendUserDataToWeb(io, playerMock);
    });
    test('should return the actual round and ordered players in divided arrays', ()=> {
      clientSocket.on(WEB_CURRENT_ROUND, (arg:number) => {
        expect(arg).toEqual(2);
      });
      sendCurrentRound(io, 2);
    });
  });

  describe('Mobile listener tests', () => {
    test('should send an array with the connected users to all clients on gameStart', () => {
      clientSocket.on(CONNECTED_USERS, (arg:DividedPlayers) => {
        expect(arg.dravokar[0].name).toEqual(ONLINE_USERS_MOCK[0].name);
      });
      sendConnectedUsersArrayToAll(io, ONLINE_USERS_MOCK);
    });
    test('should send an array with the connected users to web client on user connection', () => {
      clientSocket.on(CONNECTED_USERS, (arg:DividedPlayers) => {
        expect(arg.dravokar[0].name).toEqual(ONLINE_USERS_MOCK[0].name);
      });
      sendConnectedUsersArrayToWeb(io, ONLINE_USERS_MOCK);
    });
    
  });
});