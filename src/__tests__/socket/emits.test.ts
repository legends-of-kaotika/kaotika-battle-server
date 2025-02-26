/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import Client from 'socket.io-client';
import { GAME_USERS_MOCK, playerMock } from '../../__mocks__/players.ts';
import { ASSIGN_TURN, CONNECTED_USERS, GAME_START, WEB_CURRENT_ROUND, WEB_SEND_USER, WEB_SET_SELECTED_PLAYER } from '../../constants/sockets.ts';
import { logUnlessTesting } from '../../helpers/utils.ts';
import { DividedPlayers } from '../../interfaces/DividedPlayers.ts';
import { Player } from '../../interfaces/Player.ts';
import { sendConnectedUsersArrayToAll, sendConnectedUsersArrayToWeb, sendSelectedPlayerIdToWeb, sendUserDataToWeb } from '../../sockets/emits/user.ts';
import { sendCurrentRound } from '../../sockets/emits/game.ts';
import { returnLoyalsAndBetrayers } from '../../helpers/game.ts';

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
        expect(arg.dravokar[0].name).toEqual(GAME_USERS_MOCK[0].name);
        done();
      });
      const dividedPlayers: DividedPlayers = returnLoyalsAndBetrayers(GAME_USERS_MOCK);
      io.emit(CONNECTED_USERS, dividedPlayers);
    });
    test('should send the _id of the player that has been assigned', (done) => {
      clientSocket.on(ASSIGN_TURN, (arg:string) => {
        expect(arg).toEqual(playerMock._id); // expect an id of a player
        done();
      });
      io.emit(ASSIGN_TURN, playerMock._id);
    });
    test('should send the message game start to all devices', (done) => {
      clientSocket.on(GAME_START, () => {
        expect(true).toBe(true); // expect the socket to have been called
        done();
      });
      io.emit(GAME_START);
    });
  });
  describe('Web Emit tests', () => {
    test('should send an array with the connected users to web client on user connection', () => {
      clientSocket.on(CONNECTED_USERS, (arg:DividedPlayers) => {
        expect(arg.dravokar[0].name).toEqual(GAME_USERS_MOCK[0].name);
      });
      sendConnectedUsersArrayToWeb(GAME_USERS_MOCK);
    });
    test('should send an _id of a player', () => {
      clientSocket.on(WEB_SET_SELECTED_PLAYER, (arg:string) => {
        expect(arg).toEqual(playerMock._id); // expect an id
      });
      sendSelectedPlayerIdToWeb(playerMock);
    });
    test('should send a player', () => {
      clientSocket.on(WEB_SEND_USER, (arg:Player) => {
        expect(arg._id).toEqual(playerMock._id); // expect a player, check ids
      });
      sendUserDataToWeb(playerMock);
    });
    test('should send a player', () => {
      clientSocket.on(WEB_SEND_USER, (arg:Player) => {
        expect(arg._id).toEqual(playerMock._id); // expect a player, check ids
      });
      sendUserDataToWeb(playerMock);
    });
    test('should return the actual round and ordered players in divided arrays', ()=> {
      clientSocket.on(WEB_CURRENT_ROUND, (arg:number) => {
        expect(arg).toEqual(2);
      });
      sendCurrentRound(2);
    });
  });

  describe('Mobile listener tests', () => {
    test('should send an array with the connected users to all clients on gameStart', () => {
      clientSocket.on(CONNECTED_USERS, (arg:DividedPlayers) => {
        expect(arg.dravokar[0].name).toEqual(GAME_USERS_MOCK[0].name);
      });
      sendConnectedUsersArrayToAll(GAME_USERS_MOCK);
    });
    test('should send an array with the connected users to web client on user connection', () => {
      clientSocket.on(CONNECTED_USERS, (arg:DividedPlayers) => {
        expect(arg.dravokar[0].name).toEqual(GAME_USERS_MOCK[0].name);
      });
      sendConnectedUsersArrayToWeb(GAME_USERS_MOCK);
    });
    
  });
});