import { ONLINE_USERS } from "../game";
import { Player } from "../interfaces/Player";

//sends an array with the connected users to web client on user connection
export const findPlayerById = (_id: string): Player | string => {
  for (let i = 0; i < ONLINE_USERS.length; i++) {
    if (ONLINE_USERS[i]._id === _id) {
      return ONLINE_USERS[i];
    }
  }
  return 'No players found'
};

//sends an array with the connected users to web client on user connection
export const findPlayerBySocketId = (id: string): Player | string => {
    for (let i = 0; i < ONLINE_USERS.length; i++) {
      if (ONLINE_USERS[i].socketId === id) {
        return ONLINE_USERS[i];
      }
    }
    return 'No players found'
  };

//inserts socketId in the specific player of playerConnected[] global variable
export const insertSocketId = (email: string, socketId: string): Player | undefined => {
  const user = ONLINE_USERS.find((user)=> user.email === email);
 if (user) {
  user.socketId = socketId;
  return user;
 }
 return undefined;
}

//removes the player that got disconnected from playerConnected[] global variable
export const removePlayerConnected = (socketId: string): void => {
  const userIndex = ONLINE_USERS.findIndex((user)=> user.socketId === socketId);
  if (userIndex != -1) {
    ONLINE_USERS.splice(userIndex, 1);
  }
}


  