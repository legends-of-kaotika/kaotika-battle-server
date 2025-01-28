import { Server, Socket } from "socket.io";
import { sendAttackSelectedToWeb, sendConnectedUsersArray, sendCurseSelectedToWeb, sendHealSelectedToWeb, sendUsePotionSelectedToWeb } from "../../emits/user";
import { ONLINE_USERS } from "../../../game";
import { findPlayerById, findPlayerBySocketId } from "../../../helpers/helper";

module.exports = (io: Server, socket: Socket) => {

  socket.on("mobile-userTest", async () => {
    socket.emit("mobile-userTest", 'User for mobile');
  });

  socket.on('mobile-gameStart', async () => {
    sendConnectedUsersArray(io)
  })

  // When a player selects that is going to make an attack
  socket.on("mobile-selectAttack", async () => {
    sendAttackSelectedToWeb(io);
  });

  // When a player selects that is going to heal
  socket.on("mobile-selectHeal", async () => {
    sendHealSelectedToWeb(io);
  });

  // When a player selects that is going to curse
  socket.on("mobile-selectCurse", async () => {
    sendCurseSelectedToWeb(io);
  });

  // When a player selects that is going to use a potion
  socket.on("mobile-selectUsePotion", async () => {
    sendUsePotionSelectedToWeb(io);
  });
  
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
