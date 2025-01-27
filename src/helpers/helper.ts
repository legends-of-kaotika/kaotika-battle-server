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
  