import Die from '../classes/Die.ts';
import { DEFENSE_RULES } from '../constants/combatRules.ts';
import { Die100 } from '../constants/dies.ts';
import { Player } from '../interfaces/Player.ts';
import { ATTACK_RULES_MOD1, ATTACK_RULES_MOD2, INSANITY_RULES, CRITICAL_MOD1, CRITICAL_MOD2 } from '../constants/combatRules.ts';
import { Equipment } from '../interfaces/Equipment.ts';
import { AttackTypes } from '../interfaces/AttackTypes.ts';
import { Attack } from '../interfaces/Attack.ts';


export const adjustAtributes = (player: Player): Player => {

  const attributes = Object.keys(player.attributes) as (keyof Player['attributes'])[];

  attributes.forEach((key) => {
    // Every attribute has to be rounded to integer
    player.attributes[key] = Math.round(player.attributes[key] as number);
    // Remaining attributes will have a minimum value of 1
    if (key !== 'insanity' && key !== 'attack') {
      player.attributes[key] = Math.max(1, player.attributes[key] as number);
      //INS: min 1 - max 100
    } else if (key === 'insanity') {
      player.attributes[key] = Math.max(1, Math.min(100, player.attributes[key] as number));
    }
  });
  return player;
};

export const getCriticalPercentage = (CFP: number, successPercentage: number) => {
  return Math.ceil(CFP * successPercentage / 100);
};

export const getValueFromRule = (rule: { max: number, value: number }[], findValue: number): number => {
  const { value } = rule.find(({ max }) => findValue <= max)!;
  return value;
};

export const getInsanityModificator = (insanity: number) => {
  return getValueFromRule(INSANITY_RULES, insanity);
};

export const getAttackModificator1 = (attack: number) => {
  return getValueFromRule(ATTACK_RULES_MOD1, attack);
};

export const getAttackModificator2 = (attack: number) => {
  return getValueFromRule(ATTACK_RULES_MOD2, attack);
};

export const getAttackRoll = (): number => {
  return Die100.roll();
};

export const getSuccessPercentage = (weaponBasePercentage: number, playerDexterity: number, playerInsanity: number): number => {
  return weaponBasePercentage + Math.ceil(playerDexterity / 3) + playerInsanity;
};

export const getFumblePercentage = (playerCFP: number, successPercentage: number) => {
  return Math.floor(100 - (100 - successPercentage) * playerCFP / 100);
};
export const getDefenseModificator = (value: number): number => {
  return getValueFromRule(DEFENSE_RULES, value);
};

export const calculateTotalDefense = (totalArmorDefense: number, playerDefense: number): number => {
  return Math.floor(totalArmorDefense + playerDefense);
};

export const getWeaponDieRoll = (weaponDieNumber: number, weaponDieFaces: number, weaponDieModifier: number): number => {
  const weaponDie = new Die(weaponDieNumber, weaponDieFaces, weaponDieModifier);
  return weaponDie.rollWithModifier();
};

export const getEquipmentDefense = (equipment: Equipment): number => {
  return Object.values(equipment)
    .filter(item => item?.defense)
    .reduce((total, item) => total + item.defense, 0);
};

// ---- CRITICAL ATTACK ---- // 

export const getCriticalAttackModifier1 = (attackPercentage: number, criticalPercentage: number) => {
  const criticalPercentageMod = (attackPercentage / criticalPercentage) * 100;
  return getValueFromRule(CRITICAL_MOD1, criticalPercentageMod);
};

export const getCriticalAttackModifier2 = (attackPercentage: number, criticalPercentage: number) => {
  const criticalPercentageMod = (attackPercentage / criticalPercentage) * 100;
  return getValueFromRule(CRITICAL_MOD2, criticalPercentageMod);
};

export const calculateCriticalHitDamage = (bcfa: number, weaponRoll: number, critMod1: number, critMod2: number) => {
  return Math.ceil(bcfa / 5 + weaponRoll * critMod1 + critMod2);
};

export const getCriticalHitDamage = (BCFA: number, weaponRoll: number, attackPercentage: number, criticalPercentage: number) => {
  const critMod1 = getCriticalAttackModifier1(attackPercentage, criticalPercentage);
  const critMod2 = getCriticalAttackModifier2(attackPercentage, criticalPercentage);
  return calculateCriticalHitDamage(BCFA, weaponRoll, critMod1, critMod2);
};

// ---- NORMAL ATTACK ---- // 

export const calculateNormalHitDamage = (weaponRoll: number, attackMod1: number, attackMod2: number, defenseMod: number): number => {
  const value = Math.ceil((weaponRoll * attackMod1 + attackMod2) / defenseMod);
  return value || 1;
};

export const getNormalHitDamage = (weaponRoll: number, attackAttribute: number, targetEquipment: Equipment, targetDefenseAttribute: number, attMod2IncreaseRate: number = 0) => {
  const attackMod1 = getAttackModificator1(attackAttribute);
  const attackMod2 = getAttackModificator2(attackAttribute);
  const equipmentDefense = getEquipmentDefense(targetEquipment);
  const totalDefense = calculateTotalDefense(equipmentDefense, targetDefenseAttribute);
  const defenseMod = getDefenseModificator(totalDefense);
  const attackMod2Increase = attackMod2 * attMod2IncreaseRate;
  return calculateNormalHitDamage(weaponRoll, attackMod1, attackMod2 + attackMod2Increase, defenseMod);
};

export const attack = (target: Player, attacker: Player, attackRoll: number, successPercentage: number, criticalPercentage: number, weaponRoll: number) => {
  target = adjustAtributes(attacker);
  attacker = adjustAtributes(target);

  const fumblePercentage = getFumblePercentage(target.attributes.CFP, successPercentage);
  let hitDamage: number;
  let attackType: AttackTypes;
  if (attackRoll <= criticalPercentage) {
    const critMod1 = getCriticalAttackModifier1(attackRoll, criticalPercentage);
    const critMod2 = getCriticalAttackModifier2(attackRoll, criticalPercentage);
    hitDamage = getCriticalHitDamage(target.attributes.BCFA, weaponRoll, critMod1, critMod2);
    attackType = 'CRITICAL';
  }
  else if (attackRoll <= successPercentage) {
    const totalDefense = attacker.attributes.defense + attacker.equipment.armor.defense;
    const defMod = getDefenseModificator(totalDefense);
    hitDamage = getNormalHitDamage(weaponRoll, attacker.attributes.attack, target.equipment, defMod);
    attackType = 'NORMAL';
  }
  else if (attackRoll <= 100 - fumblePercentage) {
    hitDamage = 0;
    attackType = 'FAILED';
  }
  else {
    hitDamage = 0;
    attackType = 'FUMBLE';
  }
  return {hitDamage, attackType};
};

export const attackData = (targetPlayerId: string, hit_points: number,criticalPercentage: number,normalPercentage: number,failedPercentage: number,fumblePercentage: number,attackerHasLuck: boolean,attackerLuckRolls: number[],defenderHasLuck: boolean,defenderLuckRolls: number[],attackerLuckMessage: string,defenderLuckMessage: string, attackRoll: number, attackerDealedDamage: number): Attack[] => {
  const attackJSON: Attack[] = [
    {
      attack: {
        targetPlayerId: targetPlayerId,
        hit_points: hit_points,
        percentages: {
          critical: criticalPercentage,
          normal: normalPercentage,
          failed: failedPercentage,
          fumble: fumblePercentage
        },
        dieRoll: attackRoll,
        dealedDamage: attackerDealedDamage
      },
      luck: {
        attacker: {
          hasLuck: attackerHasLuck,
          luckRolls: attackerLuckRolls,
          luckRollMessage: attackerLuckMessage
        },
        defender: {
          hasLuck: defenderHasLuck,
          luckRolls: defenderLuckRolls,
          luckRollMessage: defenderLuckMessage
        }
      }
    }
  ];
  return attackJSON;
};