import { Server, Socket } from "socket.io";
import { sendConnectedUsersArray } from "../../emits/user";
import { ONLINE_USERS } from "../../../game";
import { findPlayerById, findPlayerBySocketId } from "../../../helpers/helper";

module.exports = (io: Server, socket: Socket) => {

  socket.on("mobile-userTest", async () => {
    socket.emit("mobile-userTest", 'User for mobile');
  });

  socket.on('mobile-gameStart', async () => {
    sendConnectedUsersArray(io)
  })

  socket.on('mobile-attack', async (data) => {
    const { _id } = data;
    let attacker = findPlayerById(_id);
    let defender = findPlayerBySocketId(socket.id);
    
    //calculate damage
    let totalDmg = 0;


    //return players to web
    sendConnectedUsersArray(io)
  })
  
}
