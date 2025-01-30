import { Server, Socket } from "socket.io";
import { assingTurn, sendConnectedUsersArrayToAll, sendCurseSelectedToWeb, sendHealSelectedToWeb, sendSelectedPlayerIdToWeb, sendUpdatedPlayer, sendUsePotionSelectedToWeb, sendUserDataToWeb } from "../../emits/user";
import { findPlayerById, findPlayerBySocketId, insertSocketId } from "../../../helpers/helper";
import { MOBILE, MOBILE_ATTACK, MOBILE_GAME_START, MOBILE_SELECT_CURSE, MOBILE_SELECT_HEAL, MOBILE_SELECT_USE_POTION, MOBILE_SEND_SOCKET_ID, MOBILE_SET_SELECTED_PLAYER, TURN_START } from "../../../constants/constants";
import { startTimer } from "../../../timer/timer";
import { sortPlayersByCharisma } from "../../../helpers/sort";
import { ONLINE_USERS, currentPlayer, round, setCurrentPlayer, setTarget, target, turn } from "../../../game";
import { Player } from "../../../interfaces/Player";
import { calculateAttack, calculateDefense } from "../../../services/playerService";


export const mobileUserHandlers = (io: Server, socket: Socket): void => {

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
    //sort players by charisma
    sortPlayersByCharisma(ONLINE_USERS);

    //assign the first player
    console.log('Round: ', round);
    setCurrentPlayer(ONLINE_USERS[turn]);

    //divide players by loyalty
    sendConnectedUsersArrayToAll(io)

    //emit first turn player id
    assingTurn(io, currentPlayer!);
    startTimer();
  })

  // When the current turn player selects a player
  socket.on(MOBILE_SET_SELECTED_PLAYER, async (_id:string) => {
    console.log('mobile-setSelectedPlayer socket message listened.')
    const newTarget = findPlayerById(_id);
    setTarget(newTarget!)
    sendSelectedPlayerIdToWeb(io, target);
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
    //Find the the players currently fighting
    let attacker = findPlayerBySocketId(socket.id);

      if(!target || !attacker){
        console.error('Either attacker or target not found');
        return;
      } 
    
    //Calculate the damage dealt by the attacker
    let totalDmg = calculateAttack(attacker.attributes);

    //Calculate the target's defense attribute and by how much it reduces the total damage dealt 
    const targetDefense = calculateDefense(target.attributes);
    totalDmg = Math.max(0, totalDmg - targetDefense);

    // //Applies any status effects or modifiers currently in effect to the damage dealt
    // if(attacker?.status.ethaziumCurse){
    //   totalDmg = Math.floor(totalDmg * ?); //The attackers total damage is reduced by % [ETHAZIUM CURSE]
    // }

    // if(attacker?.status.tired){
    //   totalDmg = Math.floor(totalDmg * ?); //The attackers total damage is reduced by % [TIRED]
    // }

    //Emits the attack results to mobile clients
    sendUpdatedPlayer(io, attacker._id, target.attributes, totalDmg)

    //Updates the target's hit points
    target.attributes.hit_points = Math.max(0, target.attributes.hit_points - totalDmg);

    //return updated players to web
    sendConnectedUsersArrayToAll(io)
  })
}
