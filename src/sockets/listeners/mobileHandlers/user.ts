import { Server, Socket } from "socket.io";
import { sendAttackSelectedToWeb, sendConnectedUsersArray, sendCurseSelectedToWeb, sendHealSelectedToWeb, sendUsePotionSelectedToWeb, sendUserDataToWeb } from "../../emits/user";
import { ONLINE_USERS } from "../../../game";
import { findPlayerById, findPlayerBySocketId, insertSocketId, removePlayerConnected } from "../../../helpers/helper";
import { Player } from "../../../interfaces/Player";

module.exports = (io: Server, socket: Socket) => {

  socket.on("mobile-userTest", async () => {
    socket.emit("mobile-userTest", 'User for mobile');
  });

  //////////////////////////////////////////////////
  //receive socketId + email from clientMobile
  socket.on("mobile-sendSocketId", async (email: string) => {
    console.log(`new player with socketId: ${socket.id} ${email}`);
    const newPlayerConnected = insertSocketId(email, socket.id);
    if(newPlayerConnected){
      sendUserDataToWeb(io, newPlayerConnected);
    }    
  })
  ///////////////////////////////////////////////////
  // //when player disconnects
  // socket.on("disconnect", async () => {
  //   console.log(`player with socketId ${socket.id} disconnected`);
  //   removePlayerConnected(socket.id);
  //   console.log("quitado victor: " + JSON.stringify(ONLINE_USERS));
  //   socket.broadcast.emit("playerDisconnected", {playerSocketId: socket.id});
  // })

  ////////////////////////////////////////////////////

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
