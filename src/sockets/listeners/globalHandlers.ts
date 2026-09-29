import { Socket } from 'socket.io';
import { DISCONNECT } from '../../constants/sockets.ts';
import { CONNECTED_USERS, GAME_USERS, claimTurnAdvance, currentPlayer, getPendingActionTargetId, isAttackPending, isGameStarted, setWebSocket, target, turnGeneration, webSocketId } from '../../game.ts';
import { changeTurn, completeAttackTurn, handleGameEnd, isGameEnded } from '../../helpers/game.ts';
import { findPlayerBySocketId, removePlayerConnected, removePlayerFromGameUsersById } from '../../helpers/player.ts';
import { sleep } from '../../helpers/utils.ts';
import { sendWebTurnFinished } from '../emits/game.ts';
import { sendPlayerDisconnectedToWeb, sendPlayerRemoved } from '../emits/user.ts';
import { onAsync } from '../guards.ts';
import { scheduleDisconnectGrace } from '../reconnect.ts';

export const globalHandlers = (socket: Socket): void => {
  onAsync(socket, DISCONNECT, async () => {
    if (socket.id === webSocketId) setWebSocket('');

    const player = findPlayerBySocketId(socket.id);
    const disconnectedTurnGeneration = turnGeneration;
    const shouldAdvance = Boolean(player && (player._id === currentPlayer?._id || player._id === target?._id));
    console.log(`${player?.nickname || `Player with socket id ${socket.id}`} disconnected.`);

    if (player && isGameStarted) {
      removePlayerConnected(socket, true);
      scheduleDisconnectGrace(player._id, socket.id, async () => {
        let gamePlayer = GAME_USERS.find((candidate) => candidate._id === player._id);
        const reconnected = CONNECTED_USERS.some((candidate) => candidate._id === player._id);
        if (!gamePlayer || gamePlayer.socketId !== socket.id || reconnected) return;

        if (isAttackPending()) {
          const pendingTargetId = getPendingActionTargetId();
          if (pendingTargetId) await completeAttackTurn(pendingTargetId);
          gamePlayer = GAME_USERS.find((candidate) => candidate._id === player._id);
          if (!gamePlayer) return;
        }

        removePlayerFromGameUsersById(player._id);
        sendPlayerRemoved(player._id);
        sendPlayerDisconnectedToWeb(player.nickname);

        if (isGameStarted && isGameEnded()) {
          await handleGameEnd();
          return;
        }
        if (shouldAdvance && claimTurnAdvance(disconnectedTurnGeneration)) {
          sendWebTurnFinished();
          await sleep(1000);
          await changeTurn(disconnectedTurnGeneration, true);
        }
      });
    } else {
      removePlayerConnected(socket);
    }

    socket.removeAllListeners();
  });
};
