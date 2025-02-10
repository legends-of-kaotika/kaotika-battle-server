import { ONLINE_USERS } from '../game.ts';
import { Player } from '../interfaces/Player.ts';

// Inserts socketId in the specific player of playerConnected[] global variable
export const insertSocketId = (email: string, socketId: string): Player | undefined => {
  const user = ONLINE_USERS.find((user) => user.email === email);
  if (user) {
    user.socketId = socketId;
    return user;
  }
  return undefined;
};