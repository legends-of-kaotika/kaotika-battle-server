import { Server, Socket } from "socket.io";
import { sendAttackSelectedToWeb, sendConnectedUsersArrayToAll, sendCurseSelectedToWeb, sendHealSelectedToWeb, sendUsePotionSelectedToWeb, sendUserDataToWeb } from "../../emits/user";
import { ONLINE_USERS } from "../../../game";
import { findPlayerById, findPlayerBySocketId, insertSocketId, removePlayerConnected } from "../../../helpers/helper";
import { Player } from "../../../interfaces/Player";
import { MOBILE, MOBILE_ATTACK, MOBILE_GAME_START, MOBILE_SELECT_ATTACK, MOBILE_SELECT_CURSE, MOBILE_SELECT_HEAL, MOBILE_SELECT_USE_POTION, MOBILE_SEND_SOCKET_ID } from "../../../constants/constants";

module.exports = (io: Server, socket: Socket) => {

  //receive socketId + email from clientMobile
  socket.on(MOBILE_SEND_SOCKET_ID, async (email: string) => {
    console.log(`new player with socketId: ${socket.id} ${email}`);
    const newPlayerConnected = insertSocketId(email, socket.id);
    if(newPlayerConnected){
      socket.join(MOBILE)
      sendUserDataToWeb(io, newPlayerConnected);
    }    
  })

  // When Mortimer presses the START Button
  socket.on(MOBILE_GAME_START, async () => {
    console.log('mobile-gameStart socket message listened. Sending Online users to everyone.')
    sendConnectedUsersArrayToAll(io)
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

  socket.on(MOBILE_ATTACK, async (data) => {
    const { _id } = data;
    let attacker = findPlayerById(_id);
    let defender = findPlayerBySocketId(socket.id);
    
    //calculate damage
    let totalDmg = 0;


    //return players to web
    sendConnectedUsersArrayToAll(io)
  })
}
