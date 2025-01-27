import { Server, Socket } from "socket.io";
import { sendConnectedUsersArray } from "../../emits/user";
import { ONLINE_USERS } from "../../../game";

module.exports = (io: Server, socket: Socket) => {

  socket.on("mobile-userTest", async () => {
    socket.emit("mobile-userTest", 'User for mobile');
  });

  socket.on('mobile-gameStart', async () => {
    sendConnectedUsersArray(io)
  })

  socket.on('mobile-attack', async (data) => {
    const { _id } = data;
    let attacker;
    let defender;
    for (let i = 0; i < ONLINE_USERS.length; i++) {
      if (ONLINE_USERS[i].socketId === socket.id) {
        attacker = ONLINE_USERS[i];
      }
      if (ONLINE_USERS[i]._id === _id) {
        defender = ONLINE_USERS[i];
      } 
    } 

    //calculate damage
    let totalDmg = 0;

    
    //return players to web
    sendConnectedUsersArray(io)
  })
  
}
