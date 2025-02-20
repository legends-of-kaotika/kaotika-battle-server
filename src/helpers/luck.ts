import { ATTACK_LUCK_RULES, ATTACK_RULES_LUCK_MOD, DEFENSE_LUCK_RULES, LUCK_ATTACK_INCREEASE } from '../constants/combatRules.ts';
import { Die100 } from '../constants/dies.ts';
import { Luck } from '../interfaces/Luck.ts';
import { ATTACK_LUCK_EFFECTS, DEFENSE_LUCK_EFFECTS } from '../constants/game.ts';
import { idPlayerFirstTurn, setPlayerFirstTurnId } from '../game.ts';
import { AttackTypes } from '../interfaces/AttackTypes.ts';
import { Player } from '../interfaces/Player.ts';
import { getCriticalHitDamage, getNormalHitDamage, getValueFromRule } from './attack.ts';
import { ApplyLuck } from '../interfaces/ApplyLuck.ts';
import { LUCK_MESSAGE } from '../constants/messages.ts';
import { LuckDefender as LuckDefender } from '../interfaces/LuckDefender.ts';
import { LuckAttacker as LuckAttacker } from '../interfaces/LuckAttacker.ts';
import { ReducedAttacker } from '../interfaces/ReducedAttacker.ts';
import { ReducedDefender } from '../interfaces/ReducedDefender.ts';

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

export const getDefenseLuckConstant = (luckRoll: number): number => {
  return getValueFromRule(DEFENSE_LUCK_RULES, luckRoll);
};

export const getAttackLuckConstant = (luckRoll: number): number => {
  return getValueFromRule(ATTACK_LUCK_RULES, luckRoll);
};

// ---- DEFENSE  ---- // 

export const applyDefenseLuck = (dealedDamage: number, defender: LuckDefender): ApplyLuck => {

  const roll = Die100.roll();
  const defenseLuck = getDefenseLuckConstant(roll);
  let luckMessage = LUCK_MESSAGE.NO_EFFECT;
  
  switch(defenseLuck){

  case DEFENSE_LUCK_EFFECTS.NO_DAMAGE_RECEIVED:
    dealedDamage = 0;
    luckMessage = LUCK_MESSAGE.DODGE;
    break;
  
  case DEFENSE_LUCK_EFFECTS.START_NEXT_ROUND:

    if(idPlayerFirstTurn === null){
      setPlayerFirstTurnId(defender._id);
      luckMessage = LUCK_MESSAGE.TURN_EFFECT;
    }
    break;
  }

  return {luckMessage, dealedDamage};
};

export const defenderLuck = (originalDealedDamage: number, defender: LuckDefender): Luck => {

  const defenderLuckRolls = luckRolls(defender.attributes.charisma);
  const defenderHasLuck = hasLuck(defenderLuckRolls);

  if (defenderHasLuck) {
    const {luckMessage, dealedDamage} = applyDefenseLuck(originalDealedDamage, defender);
    return { hasLuck: defenderHasLuck, luckRolls: defenderLuckRolls, dealedDamage, luckMessage };
  }

  return { hasLuck: defenderHasLuck, luckRolls: defenderLuckRolls, dealedDamage: originalDealedDamage, luckMessage: LUCK_MESSAGE.DEFENDER_NO_LUCK };
};

// ---- ATTACK  ---- // 

export const attackerLuck = ( attacker: LuckAttacker,
  defender: LuckDefender,
  baseDealedDamage: number, 
  attackType: AttackTypes, 
  weaponRoll: number, 
  attackPercentage: number, 
  criticalPercentage: number ): Luck => {

  const attackerLuckRolls = luckRolls(attacker.attributes.charisma);
  const attackerHasLuck = hasLuck(attackerLuckRolls);

  if (attackerHasLuck) {
    const {dealedDamage, luckMessage} = applyAttackLuck(baseDealedDamage, attackType, weaponRoll, attackPercentage, criticalPercentage, attacker, defender);
    return { hasLuck: attackerHasLuck, luckRolls: attackerLuckRolls, luckMessage, dealedDamage };
  }

  return { hasLuck: attackerHasLuck, luckRolls: attackerLuckRolls, dealedDamage: baseDealedDamage, luckMessage: LUCK_MESSAGE.ATTACKER_NO_LUCK};
};

export const applyAttackLuck = (dealedDamage: number, attackType: AttackTypes, weaponRoll: number, attackPercentage: number, criticalPercentage: number, attacker: LuckAttacker, defender: LuckDefender): ApplyLuck => {

  const roll = Die100.roll();
  let luckMessage = LUCK_MESSAGE.NO_EFFECT;
  
  const attackLuckConstant = getAttackLuckConstant(roll);

  switch (attackLuckConstant) {

  case ATTACK_LUCK_EFFECTS.NEXT_ROUND_START_FIRST:
    if(idPlayerFirstTurn === null){
      setPlayerFirstTurnId(attacker._id);
      luckMessage = LUCK_MESSAGE.TURN_EFFECT;
    }
    break;

  case ATTACK_LUCK_EFFECTS.NORMAL_TO_CRITICAL: {

    if (attackType !== 'NORMAL') {
      break;
    }

    dealedDamage = getCriticalHitDamage(attacker.attributes.BCFA, weaponRoll, attackPercentage, criticalPercentage);
    luckMessage = LUCK_MESSAGE.CRITICAL_EFFECT;
    break;

  } case ATTACK_LUCK_EFFECTS.NORMAL_ATTACK_INCREASE: {

    if (attackType !== 'NORMAL') {
      break;
    }
    
    const attackMod2Increase = getValueFromRule(ATTACK_RULES_LUCK_MOD, roll);
    dealedDamage = getNormalHitDamage(weaponRoll, attacker.attributes.attack, defender.equipment, defender.attributes.defense, attackMod2Increase);
    const increaseType = getIncreseType(roll);
    luckMessage = increaseType;

    break;
  }
  }

  return {
    dealedDamage,
    luckMessage
  };

};
export const getIncreseType = (roll:number):string =>{
  const {effect} = LUCK_ATTACK_INCREEASE.find((element)=> (roll <= element.max))!;
  return effect;
};

export const defenderReducedForLuck = (defender: Player): LuckDefender => {

  return {
    _id: defender._id,
    attributes: {
      charisma: defender.attributes.charisma,
      defense: defender.attributes.defense
    },
    equipment: defender.equipment
  };
};

export const attackerReducedForLuck = (attacker: Player): LuckAttacker => {

  return {
    _id: attacker._id,
    attributes: {
      charisma: attacker.attributes.charisma,
      BCFA: attacker.attributes.BCFA,
      attack: attacker.attributes.attack
    }
  };
};

export const attackerReducedForAttack = (attacker: Player): ReducedAttacker => {
  return {
    attributes: {
      BCFA: attacker.attributes.BCFA,
      attack: attacker.attributes.attack
    }
  };
};

export const defenderReducedForAttack = (defender: Player): ReducedDefender => {
  return {
    attributes: {
      defense: defender.attributes.defense
    },
    equipment: defender.equipment
  };
};
