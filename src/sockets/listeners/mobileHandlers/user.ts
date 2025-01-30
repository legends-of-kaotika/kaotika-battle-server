import { Server, Socket } from "socket.io";
import { assingTurn, sendConnectedUsersArrayToAll, sendCurseSelectedToWeb, sendHealSelectedToWeb, sendSelectedPlayerIdToWeb, sendUsePotionSelectedToWeb, sendUserDataToWeb } from "../../emits/user";
import { findPlayerById, findPlayerBySocketId, insertSocketId } from "../../../helpers/helper";
import { MOBILE, MOBILE_ATTACK, MOBILE_GAME_START, MOBILE_SELECT_CURSE, MOBILE_SELECT_HEAL, MOBILE_SELECT_USE_POTION, MOBILE_SEND_SOCKET_ID, MOBILE_SET_SELECTED_PLAYER, TURN_START } from "../../../constants/constants";
import { startTimer } from "../../../timer/timer";
import { sortPlayersByCharisma } from "../../../helpers/sort";
import { ONLINE_USERS } from "../../../game";
import { Player } from "../../../interfaces/Player";

let target: Player | undefined;
let currentPlayer: Player | undefined;

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
    currentPlayer = ONLINE_USERS[0];

    //divide players by loyalty
    sendConnectedUsersArrayToAll(io)

    //emit first turn player id
    assingTurn(io, currentPlayer);
    startTimer();
  })

  // When the current turn player selects a player
  socket.on(MOBILE_SET_SELECTED_PLAYER, async (_id:string) => {
    console.log('mobile-setSelectedPlayer socket message listened.')
    target = findPlayerById(_id)
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

  socket.on(MOBILE_ATTACK, async () => {
    let attacker = findPlayerBySocketId(socket.id);
    
    //calculate damage
    let totalDmg = 10;

    //return players to web
    sendConnectedUsersArrayToAll(io)
  })
}
