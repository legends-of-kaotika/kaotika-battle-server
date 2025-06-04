import { ATTACK_TYPES } from '../constants/combatRules.ts';
import { LUCK_MESSAGE } from '../constants/messages.ts';
import { GAME_USERS, currentPlayer, increaseTurn, resetInitialGameValues, selectedBattleId, setCurrentPlayer, setTarget, target, turn } from '../game.ts';
import { DealedDamage } from '../interfaces/DealedDamage.ts';
import { DividedPlayers } from '../interfaces/DividedPlayers.ts';
import { Fumble, FumbleWeb } from '../interfaces/Fumble.ts';
import { Luck } from '../interfaces/Luck.ts';
import { Percentages } from '../interfaces/Percentages.ts';
import { Player } from '../interfaces/Player.ts';
import { assignTurn, sendAttackInformationToWeb, sendGameEnd } from '../sockets/emits/user.ts';
import { clearTimer, startTimer } from '../timer/timer.ts';
import { adjustAtributes, attack, getAttackRoll, getCriticalPercentage, getFumblePercentage, getSuccessPercentage, getWeaponDieRoll, parseAttackData } from './attack.ts';
import { getCalculationFumblePercentile, getFumble, getFumbleEffect } from './fumble.ts';
import { attackerLuck, attackerReducedForAttack, attackerReducedForLuck, defenderLuck, defenderReducedForAttack, defenderReducedForLuck } from './luck.ts';
import { npcAttack } from './npc.ts';
import { applyDamage, findPlayerById } from './player.ts';
import { sleep } from './utils.ts';

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
export const changeTurn = async (): Promise<void> => {

  increaseTurn();
  const nextPlayer = GAME_USERS[turn];
  setCurrentPlayer(nextPlayer);
  if (currentPlayer) {
    assignTurn(currentPlayer);
    clearTimer();
    startTimer();

    if (currentPlayer.role === 'npc') {
      npcAttack();
    }
  }
  if (isGameEnded()) {
    await handleGameEnd();
  }

};

// Returns true if any of the sides has no players
export const isGameEnded = (): boolean => {
  const dividedPlayers: DividedPlayers = returnLoyalsAndBetrayers(GAME_USERS);
  return (dividedPlayers.dravokar.length === 0 || dividedPlayers.kaotika.length === 0); 
};

// Returns the winner side
export const getWinnerSide = (): 'kaotika' | 'dravokar' | 'draw' | null => {
  if (!isGameEnded()) {
    return null;
  }

  const dividedPlayers: DividedPlayers = returnLoyalsAndBetrayers(GAME_USERS);
  if (dividedPlayers.dravokar.length === 0) {
    return 'kaotika';
  } else if (dividedPlayers.kaotika.length === 0) {
    return 'dravokar';
  }
  return 'draw';
};

// Handles the game end
export const handleGameEnd = async (): Promise<void> => {
  const winnerSide = getWinnerSide();

  if (!winnerSide) {
    console.error('No winner side found. Probably game is not ended.');
    return;
  }

  // Send the winner side to all devices
  const winnerSideCapitalized = winnerSide.charAt(0).toUpperCase() + winnerSide.slice(1);
  sendGameEnd(winnerSideCapitalized);

  // If the winner is Kaotika, we want to store the result in the database.
  if (winnerSide === 'kaotika') {
    const kaotika = returnLoyalsAndBetrayers(GAME_USERS).kaotika;
    await sendBattleWinners(kaotika, selectedBattleId);
  }

  // Wait for 5 seconds to show the winner side 
  await sleep(5000);

  // Restart game values
  resetInitialGameValues();
};
  
// Check if there is the minimum 1 player connected and of role acolyte no betrayer
export const checkStartGameRequirement = (): boolean => {
  if (GAME_USERS.length >= 1) {
    return GAME_USERS.some((user) => (user.role === 'acolyte' && user.isBetrayer === false));
  }
  return false;
};

export const nextRoundStartFirst = (id: string, players: Player[]): void => {
  const player = findPlayerById(id);
  const i = players.findIndex(player => player._id === id);

  if (i === -1 || !player) return;

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
  const fumblePercentage = getFumblePercentage(attacker.attributes.CFP, successPercentage);
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
    dealedObjectDamage = { hit_points: dealedDamage };
  }

  //-----------------------------------------------------------------------------//

  // Update player's attributes in GAME_USERS
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
  sendAttackInformationToWeb(attackJSON);


};

async function sendBattleWinners(kaotika: Player[], battleID: string | null) {

  if (!battleID) {
    console.error('No battleID assigned');
    return;
  }

  const winnersData = parseWinners(kaotika);
  const body = {
    players: winnersData,
    battleID
  };

  console.log('Sending winners to API: ', body);

  // Send the winners to the database
  try {
    const response = await fetch(`${process.env.KAOTIKA_SERVER}/winners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      console.error('Error sending winners to API:', response.statusText);
    }
  } catch (error) {
    console.error('Error sending winners to API:', error);
  }
}

function parseWinners(kaotika: Player[] ): { email: string; isAlive: boolean; }[] {

  const parsedPlayers:{ email: string; isAlive: boolean; }[] = [];
  kaotika.map(({ email, isAlive }) => (parsedPlayers.push({
    email,
    isAlive,
  })));
  return parsedPlayers;

}

