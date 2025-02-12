import { DEFENSE_LUCK_RULES } from '../constants/combatRules.ts';
import { Die100 } from '../constants/dies.ts';
import { DEFENSE_LUCK_EFFECTS } from '../constants/game.ts';
import { AttackerLuck } from '../interfaces/AttackerLuck.ts';
import { Player } from '../interfaces/Player.ts';
import { getCriticalHitDamage, getValueFromRule } from './attack.ts';
import { nextRoundStartFirst, noDamageReceived } from './game.ts';
import { AttackTypes } from '../interfaces/AttackTypes.ts';
import { playerMock } from '../__mocks__/players.ts';

export const luckRolls = (charisma: number): number[] => {

  const rollTimes = Math.floor(charisma / 20);
  const luckRolls: number[] = [];

  for (let i = 0; i < rollTimes; i++) {
    const roll = Die100.roll();
    luckRolls.push(roll);
    if (roll < 20) {
      // If a throw is successful, the player is already lucky, so no further throws are needed.
      break;
    }
  }

  return luckRolls;
};

export const hasLuck = (luckRolls: number[]): boolean => {
  return luckRolls.some(roll => roll<20);
};

export const applyDefenseLuck = (defender: Player) => {
  const roll = Die100.roll();
  const defenseLuck = getDefenseLuckConstant(roll);
  let rollMessage;
  
  switch(defenseLuck){
  case DEFENSE_LUCK_EFFECTS.NO_DAMAGE_RECEIVED:
    noDamageReceived();
    rollMessage = 'No damage receive';
    // No damage receiverd func
    break;
  
  case DEFENSE_LUCK_EFFECTS.START_NEXT_ROUND:
    nextRoundStartFirst(defender);
    rollMessage = 'Defender start next round';
    // defender start next round
    break;

  case DEFENSE_LUCK_EFFECTS.NO_EFFECTS:
    // void has no effects
    break;
  }
  return rollMessage;
};

export const getDefenseLuckConstant = (luckRoll: number) : number => {
  return getValueFromRule(DEFENSE_LUCK_RULES, luckRoll);
};
export const attackerLuck = (hitDamage: number, attacker: Player, attackPercentage: number, criticalPercentage: number): AttackerLuck => {

  const attackerLuckRolls = luckRolls(attacker.attributes.charisma);
  const attackerHasLuck = hasLuck(attackerLuckRolls);
  if(attackerHasLuck){
    //const applyLuckResult = applyAttackLuck(hitDamage,attackPercentage,criticalPercentage);
    const dealedDamage = 20;
    const attackerLuckMessage = 'Attack increase';
    return {attackerLuckRolls,attackerHasLuck,dealedDamage,attackerLuckMessage };
  }
  
};
export const defenderLuck = (defender: Player) => {

  const defenderLuckRolls = luckRolls(defender.attributes.charisma);
  const defenderHasLuck = hasLuck(defenderLuckRolls);
  if(defenderHasLuck){
    const applyLuckResult = applyDefenseLuck(defender);
    return {defenderLuckRolls,defenderHasLuck, applyLuckResult};
  }
};


const attacker = playerMock;
const defender = playerMock;

export const applyAttackLuck = (hitDamage: number, attackType: AttackTypes, weaponRoll: number, attackPercentage: number, criticalPercentage: number) => {

  const roll = Die100.roll();
  let rollMessage;

  if (roll >= 81) {

    // STARTS NEXT ROUND 
    nextRoundStartFirst(attacker);
    rollMessage = 'The player will start first in the next round';

  } else if (roll >= 65) {

    if (attackType !== 'NORMAL') {
      rollMessage = 'The luck roll has no effect';
    } else {
      hitDamage = getCriticalHitDamage(attacker.attributes.BCFA, weaponRoll, attackPercentage, criticalPercentage);
      rollMessage = 'The attack has been transformed into critical.';
    }
    
  } else if (roll >= 16) {

    const attackIncreaseFactor = getValueFromRule(ATTACK_RULES_LUCK_MOD, roll);
    const getDef = getDeffense;
 
    hitDamage = getNormalHitDamage(weaponRoll, attackMod1+0.5, attackMod2, defMod);

    rollMessage = `The attack modifier has been increased +${attackMod2Increased}`;
  } else {
    rollMessage = 'The luck roll has no effect';
  }

  return {
    hitDamage,
    rollMessage
  };

};