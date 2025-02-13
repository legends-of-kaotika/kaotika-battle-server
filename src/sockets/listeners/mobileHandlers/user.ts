import { Server, Socket } from 'socket.io';
import {
  assignTurn,
  gameStartToAll,
  sendConnectedUsersArrayToAll,
  sendCurseSelectedToWeb,
  sendHealSelectedToWeb,
  sendSelectedPlayerIdToWeb,
  sendUsePotionSelectedToWeb,
  sendUserDataToWeb,
  sendNotEnoughPlayers,
  sendUpdatedPlayerToAll,
  sendAttackInformationToWeb,
} from '../../emits/user.ts';
import {
  findPlayerById
} from '../../../helpers/player.ts';
import { checkStartGameRequirement } from '../../../helpers/game.ts';
import { insertSocketId } from '../../../helpers/socket.ts';
import * as SOCKETS from '../../../constants/sockets.ts';
import { startTimer } from '../../../timer/timer.ts';
import {
  ONLINE_USERS,
  currentPlayer,
  round,
  setCurrentPlayer,
  setGameStarted,
  setTarget,
  target,
  turn,
} from '../../../game.ts';
import { getPlayersTurnSuccesses, sortTurnPlayers } from '../../../helpers/turn.ts';
import { attack, getAttackRoll, getCriticalPercentage, getSuccessPercentage, getWeaponDieRoll, attackData, getFumblePercentage } from '../../../helpers/attack.ts';
import { attackerLuck, defenderLuck } from '../../../helpers/luck.ts';
import { AttackerLuck } from '../../../interfaces/AttackerLuck.ts';
import { DefenderLuck } from '../../../interfaces/DefenderLuck.ts';



export const mobileUserHandlers = (io: Server, socket: Socket): void => {

  // Receive socketId + email from clientMobile
  socket.on(SOCKETS.MOBILE_SEND_SOCKET_ID, async (email: string) => {
    console.log(`new player with socketId: ${socket.id} ${email}`);
    const newPlayerConnected = insertSocketId(email, socket.id);
    if (newPlayerConnected) {
      socket.join(SOCKETS.MOBILE); // Enter to mobile socket room 
      sendUserDataToWeb(io, newPlayerConnected);
    }
  });

  // When Mortimer presses the START Button
  socket.on(SOCKETS.MOBILE_GAME_START, async () => {

    console.log(`Socket ${SOCKETS.MOBILE_GAME_START} received`);

    // Check if there at least 1 acolyte no betrayer connected (enemy always there is one as a bot)
    if (checkStartGameRequirement() === false) {
      console.log('Not minimum 1 acolyte no betrayer connected, can\'t start game');
      sendNotEnoughPlayers(io, socket.id);
    } else {
      console.log('mobile-gameStart socket message listened. Sending Online users to everyone.');
    
      // Set game as started
      setGameStarted(true);
    
      // Sort players by successes, charisma, dexterity
      const playersTurnSuccesses = getPlayersTurnSuccesses(ONLINE_USERS);
      sortTurnPlayers(playersTurnSuccesses, ONLINE_USERS);

      // Assign the first player
      console.log('Round: ', round);
      setCurrentPlayer(ONLINE_USERS[turn]);

      // Divide players by loyalty
      sendConnectedUsersArrayToAll(io, ONLINE_USERS);

      // Emit first turn player id
      assignTurn(io, currentPlayer!);
      gameStartToAll(io);
      startTimer();
    }
    
  });

  // When the current turn player selects a player
  socket.on(SOCKETS.MOBILE_SET_SELECTED_PLAYER, async (_id: string) => {
    
    console.log(`Socket ${SOCKETS.MOBILE_SET_SELECTED_PLAYER} received`);
    
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
  socket.on(SOCKETS.MOBILE_SELECT_HEAL, async () => {
    console.log(`${SOCKETS.MOBILE_SELECT_HEAL} socket message listened. Performing heal.`);
    sendHealSelectedToWeb(io);
  });

  // When a player selects that is going to curse
  socket.on(SOCKETS.MOBILE_SELECT_CURSE, async () => {
    console.log(`${SOCKETS.MOBILE_SELECT_CURSE} socket message listened. Performing curse.`);
    sendCurseSelectedToWeb(io);
  });

  // When a player selects that is going to use a potion
  socket.on(SOCKETS.MOBILE_SELECT_USE_POTION, async () => {
    console.log(`${SOCKETS.MOBILE_SELECT_USE_POTION} socket message listened. Using potion.`);
    sendUsePotionSelectedToWeb(io);
  });

  socket.on(SOCKETS.MOBILE_ATTACK, async (_id) => {

    console.log(`${SOCKETS.MOBILE_ATTACK} socket message listened.`);

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

    const attackRoll = getAttackRoll();
    const weaponRoll = getWeaponDieRoll(target.equipment.weapon.die_num, target.equipment.weapon.die_faces, target.equipment.weapon.die_modifier);
    const successPercentage = getSuccessPercentage(target.equipment.weapon.base_percentage, target.attributes.dexterity, target.attributes.insanity);
    const criticalPercentage = getCriticalPercentage(target.attributes.CFP, successPercentage);
    const attackResult = attack(target,attacker,attackRoll,successPercentage,criticalPercentage,weaponRoll);
    const attackerLuckResult: AttackerLuck = attackerLuck(attacker, target, attackResult.hitDamage,attackResult.attackType,weaponRoll,attackRoll,criticalPercentage);
    const defenderLuckResult: DefenderLuck = defenderLuck(attackerLuckResult.dealedDamage, target);
    
    const attackerDealedDamage = attackerLuckResult.dealedDamage || 0;
    const normalPercentage = successPercentage - criticalPercentage;
    const fumblePercentage =  getFumblePercentage(attacker.attributes.CFP, successPercentage); 
    const failedPercentage = (100 - fumblePercentage) - successPercentage;
    
    //ATTACKER DATA
    const attackerHasLuck = attackerLuckResult.attackerHasLuck;
    const attackerLuckRolls = attackerLuckResult.attackerLuckRolls;
    const attackerLuckMessage = attackerLuckResult.attackerLuckMessage;

    //DEFENDER DATA
    const defenderHasLuck = defenderLuckResult.defenderHasLuck;
    const defenderLuckRolls = defenderLuckResult.defenderLuckRolls;
    const defenderLuckMessage = defenderLuckResult.defenderLuckMessage;

    const attackJSON  = attackData(target._id,target.attributes.hit_points,criticalPercentage, normalPercentage, failedPercentage,fumblePercentage,attackerHasLuck,attackerLuckRolls,defenderHasLuck,defenderLuckRolls,attackerLuckMessage,defenderLuckMessage, attackRoll, attackerDealedDamage);
    
    // method to change the player attributes in ONLINE_USERS

    // sendUpdatedPlayerToAll(io, target._id, target.attributes, 20, target.isBetrayer);
    sendAttackInformationToWeb(io,attackJSON);
        

    // When web finishes animation , server listens to server-targetPlayer and emits to mobile updatedPlayer

    // ifPlayerDies
    // sendKilledPlayer(io, '2345030d'); //sends to everyone ??

  });
};
