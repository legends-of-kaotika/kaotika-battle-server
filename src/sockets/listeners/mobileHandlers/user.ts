import { Server, Socket } from 'socket.io';
import {
  assignTurn,
  gameStartToAll,
  sendConnectedUsersArrayToAll,
  sendCurseSelectedToWeb,
  sendHealSelectedToWeb,
  sendSelectedPlayerIdToWeb,
  sendUpdatedPlayerToAll,
  sendUsePotionSelectedToWeb,
  sendUserDataToWeb,
  sendNotEnoughPlayers
} from '../../emits/user';
import {
  findPlayerById,
  insertSocketId,
} from '../../../helpers/helper';
import {
  MOBILE,
  MOBILE_ATTACK,
  MOBILE_GAME_START,
  MOBILE_SELECT_CURSE,
  MOBILE_SELECT_HEAL,
  MOBILE_SELECT_USE_POTION,
  MOBILE_SEND_SOCKET_ID,
  MOBILE_SET_SELECTED_PLAYER,
} from '../../../constants/constants';
import { startTimer } from '../../../timer/timer';
import { sortPlayersByCharisma } from '../../../helpers/sort';
import {
  ONLINE_USERS,
  currentPlayer,
  round,
  setCurrentPlayer,
  setGameStarted,
  setTarget,
  target,
  turn,
} from '../../../game';
import {
  calculateAttack,
  calculateDefense,
} from '../../../services/playerService';

export const mobileUserHandlers = (io: Server, socket: Socket): void => {
  //receive socketId + email from clientMobile
  socket.on(MOBILE_SEND_SOCKET_ID, async (email: string) => {
    console.log(`new player with socketId: ${socket.id} ${email}`);
    const newPlayerConnected = insertSocketId(email, socket.id);
    if (newPlayerConnected) {
      socket.join(MOBILE);
      sendUserDataToWeb(io, newPlayerConnected);
    }
  });

  // When Mortimer presses the START Button
  socket.on(MOBILE_GAME_START, async (socket) => {

    //Check if there at least 2 players connected
    if (ONLINE_USERS.length < 2) {
      console.log('Not at least 2 players connected, can\'t start game');
      sendNotEnoughPlayers(io, socket.id);
    }

    else {
      console.log('mobile-gameStart socket message listened. Sending Online users to everyone.');
    
      // Set game as started
      setGameStarted(true);
    
      //sort players by charisma
      sortPlayersByCharisma(ONLINE_USERS);

      //assign the first player
      console.log('Round: ', round);
      setCurrentPlayer(ONLINE_USERS[turn]);

      //divide players by loyalty
      sendConnectedUsersArrayToAll(io, ONLINE_USERS);

      //emit first turn player id
      assignTurn(io, currentPlayer!);
      gameStartToAll(io);
      startTimer();
    }

    
  });

  // When the current turn player selects a player
  socket.on(MOBILE_SET_SELECTED_PLAYER, async (_id: string) => {
    console.log('mobile-setSelectedPlayer socket message listened.');
    const newTarget = findPlayerById(_id);
    console.log('newTarget: ', newTarget?.nickname);
    
    if (!newTarget) {
      console.error('Selected player not found');
      return;
    }
  
    if (newTarget._id !== _id) {
      console.error('Target ID mismatch in selection');
      return;
    }
  
    setTarget(newTarget);
    sendSelectedPlayerIdToWeb(io, target);
  });

  // When a player selects that is going to heal
  socket.on(MOBILE_SELECT_HEAL, async () => {
    console.log('mobile-selectHeal socket message listened. Performing heal.');
    sendHealSelectedToWeb(io);
  });

  // When a player selects that is going to curse
  socket.on(MOBILE_SELECT_CURSE, async () => {
    console.log('mobile-selectCurse socket message listened. Performing curse.');
    sendCurseSelectedToWeb(io);
  });

  // When a player selects that is going to use a potion
  socket.on(MOBILE_SELECT_USE_POTION, async () => {
    console.log('mobile-selectUsePotion socket message listened. Using potion.');
    sendUsePotionSelectedToWeb(io);
  });

  socket.on(MOBILE_ATTACK, async (_id) => {
    // Ensure that there's a target selected
    if (!target) {
      console.error('No target has been selected');
      return;
    }
    // Attack the selected target vía their ID
    console.log('Attacking the player: ', target?.nickname);
    if (target._id !== _id) {
      console.error(`Attack target mismatch. Expected: ${target._id}, Received: ${_id}`);
      return;
    }
    // Define the current attacker, and ensure there's one
    const attacker = currentPlayer;
    console.log('Target being attacked by the player: ', attacker?.nickname);
    if (!attacker) {
      console.error('Attacker not found');
      return;
    }

    if (!target || !attacker) {
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

    console.log('Total damage inflicted: ', totalDmg);
    

    //Updates the target's hit points
    target.attributes.hit_points = Math.max(0,
      target.attributes.hit_points - totalDmg);

    //Emits the attack results to mobile clients
    sendUpdatedPlayerToAll(io, target._id, target.attributes, totalDmg);
  });
};
