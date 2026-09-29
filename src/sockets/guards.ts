import { Socket } from 'socket.io';
import { CONNECTED_USERS, currentPlayer, isGameEnding } from '../game.ts';
import { Player } from '../interfaces/Player.ts';

export interface SocketResponse {
  status: 'OK' | 'FAILED';
  error?: string;
  [key: string]: unknown;
}

export type SocketAck = (_response: SocketResponse) => void;

const ADMIN_ROLES = new Set(['istvan', 'villain', 'mortimer']);

export const bindPlayerToSocket = (socket: Socket, player: Player): void => {
  socket.data.clientType = 'mobile';
  socket.data.playerId = player._id;
  socket.data.playerRole = player.role;
};

export const registerWebSocket = (socket: Socket): void => {
  socket.data.clientType = 'web';
};

export const getSocketPlayer = (socket: Socket): Player | undefined => {
  if (socket.data.clientType !== 'mobile' || typeof socket.data.playerId !== 'string') return undefined;
  return CONNECTED_USERS.find((player) => player._id === socket.data.playerId && player.socketId === socket.id);
};

export const isAdminSocket = (socket: Socket): boolean => {
  const player = getSocketPlayer(socket);
  return Boolean(player && ADMIN_ROLES.has(player.role));
};

export const ownsCurrentTurn = (socket: Socket): boolean => {
  const player = getSocketPlayer(socket);
  return Boolean(!isGameEnding() && player && currentPlayer && player._id === currentPlayer._id && currentPlayer.socketId === socket.id);
};

export const isRegisteredWebSocket = (socket: Socket): boolean => socket.data.clientType === 'web';

export const reject = (event: string, callback?: SocketAck, error = 'Unauthorized socket action.'): false => {
  console.warn(`[Socket] Rejected ${event}: ${error}`);
  callback?.({ status: 'FAILED', error });
  return false;
};

export const onAsync = (socket: Socket, event: string,
  listener: (..._args: unknown[]) => Promise<void>): void => {
  socket.on(event, (...args: unknown[]) => {
    void listener(...args).catch((error) => {
      console.error(`[Socket] Unhandled error in ${event}:`, error);
      const possibleAck = args[args.length - 1];
      if (typeof possibleAck === 'function') {
        (possibleAck as SocketAck)({ status: 'FAILED', error: 'Internal server error.' });
      }
    });
  });
};
