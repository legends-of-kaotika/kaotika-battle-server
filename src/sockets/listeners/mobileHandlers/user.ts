import { Server, Socket } from "socket.io";
import { sendAttackSelectedToWeb, sendConnectedUsersArray, sendCurseSelectedToWeb, sendHealSelectedToWeb, sendUsePotionSelectedToWeb, sendUserDataToWeb } from "../../emits/user";
import { findPlayerById, findPlayerBySocketId, insertSocketId } from "../../../helpers/helper";
import { MOBILE_ATTACK, MOBILE_GAME_START, MOBILE_SELECT_ATTACK, MOBILE_SELECT_CURSE, MOBILE_SELECT_HEAL, MOBILE_SELECT_USE_POTION, MOBILE_SEND_SOCKET_ID } from "../../../constants/constants";

module.exports = (io: Server, socket: Socket) => {

  //receive socketId + email from clientMobile
  socket.on(MOBILE_SEND_SOCKET_ID, async (email: string) => {
    console.log(`new player with socketId: ${socket.id} ${email}`);
    const newPlayerConnected = insertSocketId(email, socket.id);
    if(newPlayerConnected){
      sendUserDataToWeb(io, newPlayerConnected);
    }    
  })

  // When Mortimer presses the START Button
  socket.on(MOBILE_GAME_START, async () => {
    console.log('mobile-gameStart socket message listened. Sending Online users to everyone.')
    sendConnectedUsersArray(io)
  })

  // When a player selects that is going to make an attack
  socket.on(MOBILE_SELECT_ATTACK, async () => {
    console.log('mobile-selectAttack socket message listened. Performing attack.')
    sendAttackSelectedToWeb(io);
  });

  // When a player selects that is going to heal
  socket.on(MOBILE_SELECT_HEAL, async () => {
    console.log('mobile-selectHeal socket message listened. Performing heal.')
    sendHealSelectedToWeb(io);
  });

  // When a player selects that is going to curse
  socket.on(MOBILE_SELECT_CURSE, async () => {
    console.log('mobile-selectCurse socket message listened. Performing curse.')
    sendCurseSelectedToWeb(io);
  });

  // When a player selects that is going to use a potion
  socket.on(MOBILE_SELECT_USE_POTION, async () => {
    console.log('mobile-selectUsePotion socket message listened. Using potion.')
    sendUsePotionSelectedToWeb(io);
  });  

  socket.on(MOBILE_ATTACK, async (_id) => {
    let defender = findPlayerById(_id);
    let attacker = findPlayerBySocketId(socket.id);
    
    //calculate damage
    let totalDmg = 0;


    //return players to web
    sendConnectedUsersArray(io)
  })
}
