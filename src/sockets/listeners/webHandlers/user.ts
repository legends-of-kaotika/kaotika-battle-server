import { Socket } from 'socket.io';
import { WEB_ATTACK_ANIMATION_END, WEB_SEND_SOCKET_ID, WEB_SEND_USERS, WEB_SYNC_STATE } from '../../../constants/sockets.ts';
import { GAME_USERS, currentPlayer, gameGeneration, isAttackPending, isGameCreated, isGameStarted, round, selectedBattleId, setWebSocket, target, webSocketId } from '../../../game.ts';
import { findResolvedBattleById, parseWebBattleData } from '../../../helpers/battle.ts';
import { completeAttackTurn, returnLoyalsAndBetrayers } from '../../../helpers/game.ts';
import { WebSyncState } from '../../../interfaces/WebSyncState.ts';
import { turnTime } from '../../../timer/timer.ts';
import { sendConnectedUsersArrayToWeb } from '../../emits/user.ts';
import { isRegisteredWebSocket, onAsync, registerWebSocket, reject, SocketAck } from '../../guards.ts';

const getWebSyncState = (): WebSyncState => {
  const battle = selectedBattleId ? findResolvedBattleById(selectedBattleId) : undefined;
  return {
    generation: gameGeneration,
    gameCreated: isGameCreated,
    gameStarted: isGameStarted,
    selectedBattle: battle ? parseWebBattleData(battle) : null,
    players: returnLoyalsAndBetrayers(GAME_USERS),
    currentPlayerId: currentPlayer?._id ?? null,
    targetId: target?._id ?? null,
    round,
    turnTime,
    attackPending: isAttackPending(),
  };
};

const sendSyncState = (socket: Socket, callback?: SocketAck): void => {
  const state = getWebSyncState();
  socket.emit(WEB_SYNC_STATE, state);
  callback?.({ status: 'OK', state });
};

export const webUserHandlers = (socket: Socket): void => {
  socket.on(WEB_SEND_SOCKET_ID, (callback?: SocketAck) => {
    if (webSocketId && webSocketId !== socket.id) {
      reject(WEB_SEND_SOCKET_ID, callback, 'A web socket is already registered.');
      return;
    }
    registerWebSocket(socket);
    setWebSocket(socket.id);
    sendSyncState(socket, callback);
  });

  socket.on(WEB_SYNC_STATE, (callback?: SocketAck) => {
    if (!isRegisteredWebSocket(socket) || socket.id !== webSocketId) {
      reject(WEB_SYNC_STATE, callback, 'Web socket is not registered.');
      return;
    }
    sendSyncState(socket, callback);
  });

  socket.on(WEB_SEND_USERS, (callback?: SocketAck) => {
    if (!isRegisteredWebSocket(socket)) {
      reject(WEB_SEND_USERS, callback, 'Web socket is not registered.');
      return;
    }
    sendConnectedUsersArrayToWeb(GAME_USERS);
    callback?.({ status: 'OK' });
  });

  onAsync(socket, WEB_ATTACK_ANIMATION_END, async (...args: unknown[]) => {
    const defenderId = args[0];
    const callback = typeof args[1] === 'function' ? args[1] as SocketAck : undefined;
    if (!isRegisteredWebSocket(socket)) {
      reject(WEB_ATTACK_ANIMATION_END, callback, 'Web socket is not registered.');
      return;
    }
    if (typeof defenderId !== 'string' || !await completeAttackTurn(defenderId)) {
      reject(WEB_ATTACK_ANIMATION_END, callback, 'No matching action is pending.');
      return;
    }
    callback?.({ status: 'OK' });
  });
};
