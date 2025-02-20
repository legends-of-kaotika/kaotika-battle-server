import { Server } from 'socket.io';
import { io } from '../../index.ts';
import { ONLINE_USERS, currentPlayer, target, setTarget, increaseTurn, resetInitialGameValues, setCurrentPlayer, turn } from '../game.ts';
import { DividedPlayers } from '../interfaces/DividedPlayers.ts';
import { Player } from '../interfaces/Player.ts';
import { assignTurn, sendGameEnd } from '../sockets/emits/user.ts';
import { clearTimer, startTimer } from '../timer/timer.ts';
import { findPlayerById } from './player.ts';
import { adjustAtributes, attack, getCriticalPercentage, getFumblePercentage, getSuccessPercentage, getWeaponDieRoll, parseAttackData } from './attack.ts';
import { getCalculationFumblePercentile, getFumble, getFumbleEffect } from './fumble.ts';
import { attackerLuck, attackerReducedForAttack, attackerReducedForLuck, defenderLuck, defenderReducedForAttack, defenderReducedForLuck } from './luck.ts';
import { applyDamage } from './player.ts';
import { sendAttackInformationToWeb } from '../sockets/emits/user.ts';
import { Fumble, FumbleWeb } from '../interfaces/Fumble.ts';
import { Luck } from '../interfaces/Luck.ts';
import { Percentages } from '../interfaces/Percentages.ts';
import { ATTACK_TYPES } from '../constants/combatRules.ts';
import { DealedDamage } from '../interfaces/DealedDamage.ts';
import { npcAttack } from './npc.ts';
import { LUCK_MESSAGE } from '../constants/messages.ts';

// Returns a object of loyals and betrayers
export const returnLoyalsAndBetrayers = (users: Player[]): DividedPlayers => {
  const obj: DividedPlayers = {
    kaotika: [],
    dravokar: [],
  };
  users.forEach(player => {
    if (player.isBetrayer) {
      obj.dravokar.push(player);
    } else {
      obj.kaotika.push(player);
    }
  });
  return obj;
};

// Changes the turn players
export const changeTurn = () : void => {
  increaseTurn();
  const nextPlayer = ONLINE_USERS[turn];
  setCurrentPlayer(nextPlayer);
  if (currentPlayer) {
    assignTurn(io, currentPlayer);
    clearTimer();
    startTimer();

    if (currentPlayer.role === 'npc') {
      npcAttack();
    }
    
  }
  
};

// Check if there are at least 1 player from each side
export const eachSideHasPlayers = (io: Server, users: Player[]): boolean => {

  let gameHasPlayers: boolean = true;
  const dividedPlayers: DividedPlayers = returnLoyalsAndBetrayers(users);

  if ((dividedPlayers.dravokar.length === 0) && (dividedPlayers.kaotika.length === 0)) {
    sendGameEnd(io, 'Draw');
    resetInitialGameValues();
    gameHasPlayers = false;
  } else if (dividedPlayers.dravokar.length === 0) {
    sendGameEnd(io, 'Kaotika');
    resetInitialGameValues();
    gameHasPlayers = false;
  } else if (dividedPlayers.kaotika.length === 0) {
    sendGameEnd(io, 'Dravokar');
    resetInitialGameValues();
    gameHasPlayers = false;
  }

  return gameHasPlayers;
};

// Check if there is the minimum 1 player connected and of role acolyte no betrayer
export const checkStartGameRequirement = () : boolean => {
  if (ONLINE_USERS.length >= 1) {
    return ONLINE_USERS.some((user) => (user.role === 'acolyte' && user.isBetrayer === false));
  }
  return false;
};

export const nextRoundStartFirst = (id: string, players: Player[]): void => {
  const player = findPlayerById(id);
  const i = players.findIndex(player => player._id === id);

  if (i === -1 || !player)  return;

  players.splice(i, 1);
  players.unshift(player);
};


export const attackFlow = (targetId: string) => {

  // Ensure that there's a target selected
  if (!target) {
    console.error('Target not found');
    return;
  }

  if (target._id !== targetId) {
    console.error(`Attack target mismatch. Expected: ${target._id}, Received: ${targetId}`);
    return;
  }
  
  // Define the current attacker, and ensure there's one
  const attacker = currentPlayer;
    
  if (!attacker) {
    console.error('Attacker not found');
    return;
  }

  console.log('Attacker: ', attacker.nickname);
  console.log('Target: ', target.nickname);

  // Pause the timer when a player attacks.
  clearTimer();

  // Adjust player attributes
  adjustAtributes(attacker);
  adjustAtributes(target);

  // Get general variables.
  const attackRoll = getAttackRoll();
  const weaponRoll = getWeaponDieRoll(attacker.equipment.weapon.die_num, attacker.equipment.weapon.die_faces, attacker.equipment.weapon.die_modifier);
  const successPercentage = getSuccessPercentage(attacker.equipment.weapon.base_percentage, attacker.attributes.dexterity, attacker.attributes.insanity);
  let dealedDamage: number = 0;
  let dealedObjectDamage: DealedDamage | null = null;
  let fumble: Fumble | null = null;
  let attackerLuckResult: Luck | null = null;
  let defenderLuckResult: Luck | null = null;
  let fumbleToWeb: FumbleWeb | null = null;
  

  // Get the percentages of attack types.
  const criticalPercentage = getCriticalPercentage(attacker.attributes.CFP, successPercentage);
  const fumblePercentage =  getFumblePercentage(attacker.attributes.CFP, successPercentage); 
  const normalPercentage = successPercentage - criticalPercentage;
  const failedPercentage = (100 - fumblePercentage) - successPercentage;

  // Get the attack damage and attack type
  const attackerReduced = attackerReducedForAttack(attacker);
  const defenderReduced = defenderReducedForAttack(target);
  const attackResult = attack(defenderReduced, attackerReduced, attackRoll, successPercentage, criticalPercentage, fumblePercentage, weaponRoll);
  let attackType = attackResult.attackType;   
 
  //----------------------------fumble-----------------------------//
  if (attackType === ATTACK_TYPES.FUMBLE) {
    const fumblePercentile = getCalculationFumblePercentile(fumblePercentage, attackRoll);
    const fumbleEffect = getFumbleEffect(fumblePercentile);

    if (attacker) {
      setTarget(attacker); //change target to attacker self player
      fumble = getFumble(fumbleEffect, target.attributes, weaponRoll, fumblePercentile);
      if (fumble) {
        dealedObjectDamage = fumble.damage;
        fumbleToWeb = fumble;
        delete fumbleToWeb['damage'];
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

    if (attackerLuckResult.luckMessage === LUCK_MESSAGE.CRITICAL_EFFECT) {
      attackType = ATTACK_TYPES.CRITICAL;
    }  

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

  const attackJSON = parseAttackData(target._id, target.attributes, percentages, attackRoll, dealedObjectDamage, attackType, attackerLuckResult, defenderLuckResult, fumbleToWeb);

  // Send data to web
  console.log(attackJSON);
  
  sendAttackInformationToWeb(io, attackJSON);

  //--------------------------------------------------------------------------------//

};