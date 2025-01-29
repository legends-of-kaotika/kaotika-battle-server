import { Socket } from "socket.io";
import { ONLINE_USERS } from "../game";
import { Player } from "../interfaces/Player";
import { MOBILE } from "../constants/constants";

//returns a player searched by id
export const findPlayerById = (_id: string): Player | string => {
  for (let i = 0; i < ONLINE_USERS.length; i++) {
    if (ONLINE_USERS[i]._id === _id) {
      return ONLINE_USERS[i];
    }
  }
  return "No players found";
};

//returns a player searched by socketid
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
export const removePlayerConnected = (socket: Socket, socketId: string): void => {
  const userIndex = ONLINE_USERS.findIndex((user)=> user.socketId === socketId);
  if (userIndex != -1) {    
    console.log('Player with email',ONLINE_USERS[userIndex].email, 'and socket', ONLINE_USERS[userIndex].socketId ,'disconnected');
    socket.leave(MOBILE)
    ONLINE_USERS.splice(userIndex, 1);
  }
}

//returns a player searched by email
export const findPlayerByEmail = (email: string): Player | string => {
  for (let i = 0; i < ONLINE_USERS.length; i++) {
    if (ONLINE_USERS[i].email === email) {
      return ONLINE_USERS[i];
    }
  }
  return "No players found";
};

//returns a boolean if a player is connected. searched by email
export const returnIfPlayerIsConnected = (email: string): boolean => {
  for (let i = 0; i < ONLINE_USERS.length; i++) {
    if (ONLINE_USERS[i].email === email) {
      return true;
    }
  }
  return false
};


  