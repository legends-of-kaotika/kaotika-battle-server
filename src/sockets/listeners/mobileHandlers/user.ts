import { Server, Socket } from "socket.io";
import { sendAttackSelectedToWeb, sendConnectedUsersArray, sendCurseSelectedToWeb, sendHealSelectedToWeb, sendUsePotionSelectedToWeb, sendUserDataToWeb } from "../../emits/user";
import { ONLINE_USERS } from "../../../game";
import { findPlayerById, findPlayerBySocketId, insertSocketId, removePlayerConnected } from "../../../helpers/helper";
import { Player } from "../../../interfaces/Player";

module.exports = (io: Server, socket: Socket) => {
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
    console.log('mobile-gameStart socket message listened. Sending Online users to everyone.')
    sendConnectedUsersArray(io)
  })

  // When a player selects that is going to make an attack
  socket.on("mobile-selectAttack", async () => {
    console.log('mobile-selectAttack socket message listened. Performing attack.')
    sendAttackSelectedToWeb(io);
  });

  // When a player selects that is going to heal
  socket.on("mobile-selectHeal", async () => {
    console.log('mobile-selectHeal socket message listened. Performing heal.')
    sendHealSelectedToWeb(io);
  });

  // When a player selects that is going to curse
  socket.on("mobile-selectCurse", async () => {
    console.log('mobile-selectCurse socket message listened. Performing curse.')
    sendCurseSelectedToWeb(io);
  });

  // When a player selects that is going to use a potion
  socket.on("mobile-selectUsePotion", async () => {
    console.log('mobile-selectUsePotion socket message listened. Using potion.')
    sendUsePotionSelectedToWeb(io);
  });  
}
