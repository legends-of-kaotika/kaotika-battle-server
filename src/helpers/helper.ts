import { ONLINE_USERS } from "../game";
import { Player } from "../interfaces/Player";

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
  return "No players found";
};

//returns a player searched by email
export const findPlayerByEmail = (email: string): Player | string => {
  for (let i = 0; i < ONLINE_USERS.length; i++) {
    if (ONLINE_USERS[i].email === email) {
      return ONLINE_USERS[i];
    }
  }
  return "No players found";
};
