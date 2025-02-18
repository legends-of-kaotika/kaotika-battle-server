import { Server, Socket } from 'socket.io';
import { ATTACK_TYPES } from '../../../constants/combatRules.ts';
import * as SOCKETS from '../../../constants/sockets.ts';
import {
  ONLINE_USERS,
  currentPlayer,
  resetInitialGameValues,
  round,
  setCurrentPlayer,
  setGameStarted,
  setTarget,
  target,
  turn,
} from '../../../game.ts';
import { adjustAtributes, attack, getAttackRoll, getCriticalPercentage, getFumblePercentage, getSuccessPercentage, getWeaponDieRoll, parseAttackData } from '../../../helpers/attack.ts';
import { getCalculationFumblePercentile, getFumble, getFumbleEffect } from '../../../helpers/fumble.ts';
import { checkStartGameRequirement } from '../../../helpers/game.ts';
import { attackerLuck, attackerReducedForAttack, attackerReducedForLuck, defenderLuck, defenderReducedForAttack, defenderReducedForLuck } from '../../../helpers/luck.ts';
import {
  applyDamage,
  findPlayerById
} from '../../../helpers/player.ts';
import { insertSocketId } from '../../../helpers/socket.ts';
import { getPlayersTurnSuccesses, sortTurnPlayers } from '../../../helpers/turn.ts';
import { logUnlessTesting } from '../../../helpers/utils.ts';
import { Fumble, FumbleDamage } from '../../../interfaces/Fumble.ts';
import { Luck } from '../../../interfaces/Luck.ts';
import { Percentages } from '../../../interfaces/Percentages.ts';
import { startTimer } from '../../../timer/timer.ts';
import {
  assignTurn,
  gameStartToAll,
  sendAttackInformationToWeb,
  sendConnectedUsersArrayToAll,
  sendCurseSelectedToWeb,
  sendHealSelectedToWeb,
  sendNotEnoughPlayers,
  sendSelectedPlayerIdToWeb,
  sendUsePotionSelectedToWeb,
  sendUserDataToWeb,
} from '../../emits/user.ts';



export const mobileUserHandlers = (io: Server, socket: Socket): void => {
  sendResetGame(socket, io);


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

      if (currentPlayer) {
        // Divide players by loyalty
        sendConnectedUsersArrayToAll(io, ONLINE_USERS);

        // Emit first turn player id
        assignTurn(io, currentPlayer);
        gameStartToAll(io);
        startTimer();
      }
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

    if (!target) {
      console.error('Target not found');
      return;
    }

    // Adjust player attributes
    adjustAtributes(attacker);
    adjustAtributes(target);

    // Get general variables.
    const attackRoll = getAttackRoll();
    const weaponRoll = getWeaponDieRoll(attacker.equipment.weapon.die_num, attacker.equipment.weapon.die_faces, attacker.equipment.weapon.die_modifier);
    const successPercentage = getSuccessPercentage(attacker.equipment.weapon.base_percentage, attacker.attributes.dexterity, attacker.attributes.insanity);
    let dealedDamage: number = 0;
    let dealedObjectDamage: FumbleDamage | null = null;
    let fumble: Fumble | undefined = undefined;
    let attackerLuckResult: Luck | undefined = undefined;
    let defenderLuckResult: Luck | undefined = undefined;

    // Get the percentages of attack types.
    const criticalPercentage = getCriticalPercentage(attacker.attributes.CFP, successPercentage);
    const fumblePercentage =  getFumblePercentage(attacker.attributes.CFP, successPercentage); 
    const normalPercentage = successPercentage - criticalPercentage;
    const failedPercentage = (100 - fumblePercentage) - successPercentage;

    // Get the attack damage and attack type
    const attackerReduced = attackerReducedForAttack(attacker);
    const defenderReduced = defenderReducedForAttack(target);
    const attackResult = attack(defenderReduced, attackerReduced, attackRoll, successPercentage, criticalPercentage, fumblePercentage, weaponRoll);
    const attackType = attackResult.attackType;

    //----------------------------fumble-----------------------------//
    if (attackType === ATTACK_TYPES.FUMBLE) {
      const fumblePercentile = getCalculationFumblePercentile(fumblePercentage, attackRoll);
      const fumbleEffect = getFumbleEffect(fumblePercentile);

      if (attacker) {
        setTarget(attacker); //change target to attacker self player
        fumble = getFumble(fumbleEffect, target.attributes, weaponRoll, fumblePercentile);
        if (fumble) {
          dealedObjectDamage = fumble.damage;
        }
      }
    }
    //----------------------normal, critical, failed------------------//
    else {
    // Construct attacker and defender player reduced
      const luckAttacker = attackerReducedForLuck(attacker);
      const luckDefender = defenderReducedForLuck(target);

      // Execute attacker luck
      attackerLuckResult = attackerLuck(luckAttacker, luckDefender, attackResult.dealedDamage, attackResult.attackType, weaponRoll, attackRoll, criticalPercentage);
      dealedDamage = attackerLuckResult.dealedDamage;

      // Execute defender luck
      defenderLuckResult = defenderLuck(dealedDamage, luckDefender);
      dealedDamage = defenderLuckResult.dealedDamage;

      //Dealed damage to objectDamage
      dealedObjectDamage = {hit_points: dealedDamage};
    }

    //-----------------------------------------------------------------------------//
    
    // Update player's attributes in ONLINE_USERS
    applyDamage(target._id, dealedObjectDamage);

    //---------------------------send JSON to web-----------------------------------//
    // Construct the return data JSON.
    const percentages: Percentages = {
      critical: criticalPercentage,
      normal: normalPercentage,
      failed: failedPercentage,
      fumble: fumblePercentage
    };

    const attackJSON = parseAttackData(target._id, target.attributes, percentages, attackRoll, dealedObjectDamage, attackType, attackerLuckResult, defenderLuckResult, fumble);

    // Send data to web
    sendAttackInformationToWeb(io, attackJSON); //PON EL EL DOCUMENTO DE DRIVE 
    //--------------------------------------------------------------------------------//
  });
};

const sendResetGame = (socket : Socket, io: Server) : void => {
  socket.on(SOCKETS.MOBILE_RESET_GAME, () => {
    resetInitialGameValues();
    logUnlessTesting(`listen the ${SOCKETS.MOBILE_RESET_GAME} to all`);
    io.emit(SOCKETS.GAME_RESET, () => {
      logUnlessTesting(`sending the emit ${SOCKETS.GAME_RESET}`);
    });
  });
};
