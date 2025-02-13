import { ATTACK_LUCK_RULES, ATTACK_RULES_LUCK_MOD, DEFENSE_LUCK_RULES } from '../constants/combatRules.ts';
import { Die100 } from '../constants/dies.ts';
import { AttackerLuck } from '../interfaces/AttackerLuck.ts';
import { DefenderLuck } from '../interfaces/DefenderLuck.ts';
import { ATTACK_LUCK_EFFECTS, DEFENSE_LUCK_EFFECTS } from '../constants/game.ts';
import { idPlayerFirstTurn, setPlayerFirstTurnId } from '../game.ts';
import { AttackTypes } from '../interfaces/AttackTypes.ts';
import { Player } from '../interfaces/Player.ts';
import { getCriticalHitDamage, getNormalHitDamage, getValueFromRule } from './attack.ts';
import { ApplyAttackLuck } from '../interfaces/ApplyAttackLuck.ts';

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
  return luckRolls.some(roll => roll < 20);
};

export const applyDefenseLuck = (damageReceived: number, defender: Player) => {

  const roll = Die100.roll();
  const defenseLuck = getDefenseLuckConstant(roll);
  let rollMessage = 'The roll has no effect';
  
  switch(defenseLuck){

  case DEFENSE_LUCK_EFFECTS.NO_DAMAGE_RECEIVED:
    damageReceived = 0;
    rollMessage = 'The attack has been dodged';
    break;
  
  case DEFENSE_LUCK_EFFECTS.START_NEXT_ROUND:

    if(idPlayerFirstTurn === null){
      setPlayerFirstTurnId(defender._id);
      rollMessage = 'Defender start next round';
    }
    break;
  }

  return {rollMessage, damageReceived};
};


export const getDefenseLuckConstant = (luckRoll: number): number => {
  return getValueFromRule(DEFENSE_LUCK_RULES, luckRoll);
};

export const getAttackLuckConstant = (luckRoll: number): number => {
  return getValueFromRule(ATTACK_LUCK_RULES, luckRoll);
};

export const defenderLuck = (originalReceivedDamage: number, defender: Player): DefenderLuck => {

  const defenderLuckRolls = luckRolls(defender.attributes.charisma);
  const defenderHasLuck = hasLuck(defenderLuckRolls);
  if (defenderHasLuck) {
    const applyLuckResult = applyDefenseLuck(originalReceivedDamage, defender);
    const defenderLuckMessage = applyLuckResult.rollMessage;
    const receivedDamage = applyLuckResult.damageReceived;
    return { defenderLuckRolls, defenderHasLuck, defenderLuckMessage, receivedDamage };
  }
  return { defenderHasLuck, defenderLuckRolls, receivedDamage: originalReceivedDamage };
};

export const attackerLuck = (attacker: Player, defender: Player, dealedDamageWithOutLuck: number, attackType: AttackTypes, weaponRoll: number, attackPercentage: number, criticalPercentage: number): AttackerLuck => {

  const attackerLuckRolls = luckRolls(attacker.attributes.charisma);
  const attackerHasLuck = hasLuck(attackerLuckRolls);
  if (attackerHasLuck) {
    const applyLuckResult = applyAttackLuck(dealedDamageWithOutLuck, attackType, weaponRoll, attackPercentage, criticalPercentage, attacker, defender);
    const attackerLuckMessage = applyLuckResult.rollMessage;
    const dealedDamage = applyLuckResult.dealedDamage;
    return { attackerLuckRolls, attackerHasLuck, attackerLuckMessage, dealedDamage };
  }
  return { attackerHasLuck, attackerLuckRolls, dealedDamage: dealedDamageWithOutLuck };
};

export const applyAttackLuck = (dealedDamage: number, attackType: AttackTypes, weaponRoll: number, attackPercentage: number, criticalPercentage: number, attacker: Player, defender: Player): ApplyAttackLuck => {

  const roll = Die100.roll();
  let rollMessage = 'The luck roll has no effect';
  const oldDealedDamage = dealedDamage;
  
  const attackLuckConstant = getAttackLuckConstant(roll);

  switch (attackLuckConstant) {

  case ATTACK_LUCK_EFFECTS.NEXT_ROUND_START_FIRST:
    if(idPlayerFirstTurn === null){
      setPlayerFirstTurnId(attacker._id);
      rollMessage = 'The player will start first in the next round';
    }
    break;

  case ATTACK_LUCK_EFFECTS.NORMAL_TO_CRITICAL: {

    if (attackType !== 'NORMAL') {
      break;
    }

    dealedDamage = getCriticalHitDamage(attacker.attributes.BCFA, weaponRoll, attackPercentage, criticalPercentage);
    rollMessage = `The attack has been transformed into critical (+${dealedDamage-oldDealedDamage})`;
    break;

  } case ATTACK_LUCK_EFFECTS.NORMAL_ATTACK_INCREASE: {

    const attackMod2Increase = getValueFromRule(ATTACK_RULES_LUCK_MOD, roll);
    dealedDamage = getNormalHitDamage(weaponRoll, attacker.attributes.attack, defender.equipment, defender.attributes.defense, attackMod2Increase);
    rollMessage = `The attack has been increased +${dealedDamage - oldDealedDamage}`;

    break;

  }
  }

  return {
    dealedDamage,
    rollMessage
  };

};