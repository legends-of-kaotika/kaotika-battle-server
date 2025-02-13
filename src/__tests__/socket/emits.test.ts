/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from 'socket.io';
import { createServer } from 'http';
import Client from 'socket.io-client';
import { Socket } from 'socket.io';
import { DividedPlayers } from '../../interfaces/DividedPlayers.ts';
import { ASSIGN_TURN, CONNECTED_USERS, GAME_START, SEND_TIMER, UPDATE_PLAYER, WEB_SEND_USER, WEB_SET_SELECTED_PLAYER } from '../../constants/sockets.ts';
import { assignTurn, gameStartToAll, sendConnectedUsersArrayToAll, sendConnectedUsersArrayToWeb, sendSelectedPlayerIdToWeb, sendTimerDataToAll, sendUpdatedPlayerToAll, sendUserDataToWeb } from '../../sockets/emits/user.ts';
import { attributesMock, ONLINE_USERS_MOCK, playerMock } from '../../__mocks__/players.ts';
import { Player } from '../../interfaces/Player.ts';
import { Attribute } from '../../interfaces/Attribute.ts';
import { logUnlessTesting } from '../../helpers/utils.ts';

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
      sendTimerDataToAll(io, timer);
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
    test('should send the target players(id) with the attributes updated and the total damage', (done) => {  
      interface props { //match the interface of the function
        _id: string;
        attributes: Attribute;
        totalDamage: number;
        isBetrayer: boolean;
      }
      const id = playerMock._id;
      const updatedAttributes = attributesMock;
      const totalDamage = 1;
      const isBetrayer = false;

      clientSocket.on(UPDATE_PLAYER, (args: props) => {
        expect(args._id).toBe(playerMock._id); // expect the id of the player
        expect(args.attributes).toStrictEqual(updatedAttributes); // expect the updated attributes of the player TO BE EQUAL to the updated attributes
        expect(args.totalDamage).toBe(1); // expect the totaldamage (1)
        expect(args.isBetrayer).toBe(false); // expect the isBetrayer field to be false
        done();
      });
      sendUpdatedPlayerToAll(io, id, updatedAttributes, totalDamage, isBetrayer);
    });
    
  });
  describe('Mobile Emit tests', () => {
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