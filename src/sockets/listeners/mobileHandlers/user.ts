import { Socket } from 'socket.io';
import * as SOCKETS from '../../../constants/sockets.ts';
import {
  BATTLES, CONNECTED_USERS, GAME_USERS, isGameCreated, isGameStarted, resetInitialGameValues,
  round, setGameStarted, setIsGameCreated, setSelectedBattleId, setTarget, target, webSocketId,
} from '../../../game.ts';
import { fetchBattles, getPlayerDataByEmail } from '../../../helpers/api.ts';
import { findResolvedBattleById, getResolvedBattles, parseWebBattleData } from '../../../helpers/battle.ts';
import { attackFlow, changeTurn, checkStartGameRequirement, isValidAttackTarget } from '../../../helpers/game.ts';
import { addBattleNPCsToGame } from '../../../helpers/npc.ts';
import { findPlayerById, printUsers } from '../../../helpers/player.ts';
import { getPlayersTurnSuccesses, sortTurnPlayers } from '../../../helpers/turn.ts';
import { logUnlessTesting } from '../../../helpers/utils.ts';
import { Player } from '../../../interfaces/Player.ts';
import { verifyFirebaseIdToken } from '../../../services/firebaseAuthService.ts';
import { turnTime } from '../../../timer/timer.ts';
import { io } from '../../../../index.ts';
import { sendCreatedBattleToWeb, sendIsGameCreated, sendIsGameCreatedToEmiter, sendSelectedBattleToWeb } from '../../emits/game.ts';
import {
  gameStartToAll, sendConnectedUsersArrayToAll, sendNotEnoughPlayers,
  sendSelectedPlayerIdToWeb, sendUserDataToWeb,
} from '../../emits/user.ts';
import { bindPlayerToSocket, getSocketPlayer, isAdminSocket, onAsync, ownsCurrentTurn, reject, SocketAck } from '../../guards.ts';
import { cancelDisconnectGrace } from '../../reconnect.ts';

type SignInAck = (_response: { status: 'OK'; player: Player } | { status: 'FAILED'; error: string }) => void;
type BattlesAck = (_response: { status: 'OK'; battles: unknown[] } | { status: 'FAILED'; error: string }) => void;
type JoinAck = (_response: { status: 'OK'; joinBattle: boolean } | { status: 'FAILED'; error: string }) => void;

const optionalAck = (value: unknown): SocketAck | undefined => typeof value === 'function' ? value as SocketAck : undefined;

export const mobileUserHandlers = (socket: Socket): void => {
  onAsync(socket, SOCKETS.MOBILE_SIGN_IN, async (...args: unknown[]) => {
    const email = args[0];
    const callback = args[1] as SignInAck | undefined;
    if (typeof callback !== 'function') return;
    if (typeof email !== 'string' || !email.trim()) {
      callback({ status: 'FAILED', error: 'No email received.' });
      return;
    }
    const idToken = socket.handshake.auth?.idToken;
    if (typeof idToken !== 'string' || !idToken) {
      callback({ status: 'FAILED', error: 'Firebase ID token is required.' });
      return;
    }

    let verifiedIdentity;
    try {
      verifiedIdentity = await verifyFirebaseIdToken(idToken);
    } catch {
      callback({ status: 'FAILED', error: 'Invalid Firebase ID token.' });
      return;
    }
    const requestedEmail = email.trim().toLowerCase();
    const verifiedEmail = verifiedIdentity.email.trim().toLowerCase();
    if (!verifiedIdentity.emailVerified) {
      callback({ status: 'FAILED', error: 'Firebase email is not verified.' });
      return;
    }
    if (requestedEmail !== verifiedEmail) {
      callback({ status: 'FAILED', error: 'Requested email does not match the verified identity.' });
      return;
    }

    const reconnectingPlayer = GAME_USERS.find((player) => player.email.trim().toLowerCase() === verifiedEmail);
    if (reconnectingPlayer) cancelDisconnectGrace(reconnectingPlayer._id);

    const playerData = await getPlayerDataByEmail(verifiedEmail);
    if (!playerData) {
      callback({ status: 'FAILED', error: `No player found for email ${email}.` });
      return;
    }
    if (socket.data.playerId && socket.data.playerId !== playerData._id) {
      callback({ status: 'FAILED', error: 'Socket already has an authenticated identity.' });
      return;
    }

    cancelDisconnectGrace(playerData._id);

    const existingIndex = CONNECTED_USERS.findIndex((user) => user._id === playerData._id);
    if (existingIndex !== -1) CONNECTED_USERS.splice(existingIndex, 1);
    playerData.socketId = socket.id;
    CONNECTED_USERS.push(playerData);

    const gamePlayer = GAME_USERS.find((player) => player._id === playerData._id);
    if (gamePlayer) gamePlayer.socketId = socket.id;

    bindPlayerToSocket(socket, playerData);
    socket.join(SOCKETS.MOBILE);
    printUsers();
    callback({ status: 'OK', player: playerData });
  });

  socket.on(SOCKETS.MOBILE_GAME_START, (callback?: SocketAck) => {
    if (!isAdminSocket(socket)) return void reject(SOCKETS.MOBILE_GAME_START, callback);
    if (!isGameCreated || isGameStarted) return void reject(SOCKETS.MOBILE_GAME_START, callback, 'Game is not ready to start.');
    if (!checkStartGameRequirement()) {
      sendNotEnoughPlayers(socket.id);
      callback?.({ status: 'FAILED', error: 'Not enough players.' });
      return;
    }
    setGameStarted(true);
    sortTurnPlayers(getPlayersTurnSuccesses(GAME_USERS), GAME_USERS);
    void changeTurn().catch((error) => console.error('Unable to start first turn:', error));
    sendConnectedUsersArrayToAll(GAME_USERS);
    gameStartToAll();
    console.log('Round: ', round);
    callback?.({ status: 'OK' });
  });

  socket.on(SOCKETS.MOBILE_SET_SELECTED_PLAYER, (_id: unknown, callback?: SocketAck) => {
    if (!ownsCurrentTurn(socket)) return void reject(SOCKETS.MOBILE_SET_SELECTED_PLAYER, callback);
    if (typeof _id !== 'string') return void reject(SOCKETS.MOBILE_SET_SELECTED_PLAYER, callback, 'Invalid target.');
    const newTarget = findPlayerById(_id);
    if (!newTarget) return void reject(SOCKETS.MOBILE_SET_SELECTED_PLAYER, callback, 'Selected player not found.');
    const attacker = getSocketPlayer(socket);
    if (!attacker || !isValidAttackTarget(attacker, newTarget)) {
      return void reject(SOCKETS.MOBILE_SET_SELECTED_PLAYER, callback, 'Target must be a living opponent.');
    }
    setTarget(newTarget);
    sendSelectedPlayerIdToWeb(target);
    callback?.({ status: 'OK' });
  });

  socket.on(SOCKETS.MOBILE_ATTACK, (_id: unknown, callback?: SocketAck) => {
    if (!ownsCurrentTurn(socket)) return void reject(SOCKETS.MOBILE_ATTACK, callback);
    if (typeof _id !== 'string' || turnTime <= 1 || !attackFlow(_id)) {
      return void reject(SOCKETS.MOBILE_ATTACK, callback, 'Attack is invalid or already pending.');
    }
    callback?.({ status: 'OK' });
  });

  socket.on(SOCKETS.MOBILE_CREATE_GAME, (_id: unknown, callback?: SocketAck) => {
    if (!isAdminSocket(socket)) return void reject(SOCKETS.MOBILE_CREATE_GAME, callback);
    if (isGameCreated) return void reject(SOCKETS.MOBILE_CREATE_GAME, callback, 'A game already exists.');
    if (typeof _id !== 'string') return void reject(SOCKETS.MOBILE_CREATE_GAME, callback, 'Invalid battle ID.');
    const battleData = findResolvedBattleById(_id);
    if (!battleData) return void reject(SOCKETS.MOBILE_CREATE_GAME, callback, `Battle with id ${_id} not found.`);
    setSelectedBattleId(_id);
    addBattleNPCsToGame(battleData.enemies);
    setIsGameCreated(true);
    sendCreatedBattleToWeb(parseWebBattleData(battleData));
    sendIsGameCreated();
    callback?.({ status: 'OK' });
  });

  onAsync(socket, SOCKETS.MOBILE_GET_BATTLES, async (...args: unknown[]) => {
    const callback = args[0] as BattlesAck | undefined;
    if (typeof callback !== 'function') return;
    if (!getSocketPlayer(socket)) {
      callback({ status: 'FAILED', error: 'Unauthorized socket action.' });
      return;
    }
    const battles = await fetchBattles();
    BATTLES.splice(0, BATTLES.length, ...battles);
    callback({ status: 'OK', battles: getResolvedBattles(battles) });
  });

  socket.on(SOCKETS.MOBILE_RESET_GAME, (callback?: SocketAck) => {
    if (!isAdminSocket(socket)) return void reject(SOCKETS.MOBILE_RESET_GAME, callback);
    resetInitialGameValues();
    logUnlessTesting(`listen the ${SOCKETS.MOBILE_RESET_GAME} to all`);
    callback?.({ status: 'OK' });
  });

  socket.on(SOCKETS.MOBILE_SELECTED_BATTLE, (_id: unknown, callback?: SocketAck) => {
    if (!isAdminSocket(socket)) return void reject(SOCKETS.MOBILE_SELECTED_BATTLE, callback);
    if (typeof _id !== 'string' || !findResolvedBattleById(_id)) {
      return void reject(SOCKETS.MOBILE_SELECTED_BATTLE, callback, 'Invalid battle ID.');
    }
    setSelectedBattleId(_id);
    sendSelectedBattleToWeb();
    callback?.({ status: 'OK' });
  });

  socket.on(SOCKETS.MOBILE_IS_GAME_CREATED, (callback?: SocketAck) => {
    if (!getSocketPlayer(socket)) return void reject(SOCKETS.MOBILE_IS_GAME_CREATED, callback);
    sendIsGameCreatedToEmiter(socket.id);
    callback?.({ status: 'OK' });
  });

  socket.on(SOCKETS.MOBILE_JOIN_BATTLE, (playerId: unknown, callback: JoinAck) => {
    if (typeof callback !== 'function') return;
    const player = getSocketPlayer(socket);
    if (!player || typeof playerId !== 'string' || playerId !== player._id) {
      callback({ status: 'FAILED', error: 'A socket can only join as its authenticated player.' });
      return;
    }
    if (!isGameCreated || isGameStarted) {
      callback({ status: 'OK', joinBattle: false });
      return;
    }
    const existing = GAME_USERS.find((user) => user._id === player._id);
    if (existing) {
      existing.socketId = socket.id;
      callback({ status: 'OK', joinBattle: true });
      return;
    }
    GAME_USERS.push(JSON.parse(JSON.stringify(player)) as Player);
    sendUserDataToWeb(player);
    callback({ status: 'OK', joinBattle: true });
    io.to(webSocketId).emit(SOCKETS.WEB_JOINED_BATTLE, player._id);
  });

  socket.on(SOCKETS.MOBILE_IS_GAME_STARTED, (callbackValue?: unknown) => {
    const callback = optionalAck(callbackValue);
    if (!getSocketPlayer(socket)) return void reject(SOCKETS.MOBILE_IS_GAME_STARTED, callback);
    io.to(socket.id).emit(SOCKETS.IS_GAME_STARTED, isGameStarted);
    callback?.({ status: 'OK' });
  });
};
