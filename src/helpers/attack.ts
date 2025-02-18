import Die from '../classes/Die.ts';
import { DEFENSE_RULES } from '../constants/combatRules.ts';
import { Die100 } from '../constants/dies.ts';
import { Player } from '../interfaces/Player.ts';
import { ATTACK_RULES_MOD1, ATTACK_RULES_MOD2, INSANITY_RULES, CRITICAL_MOD1, CRITICAL_MOD2 } from '../constants/combatRules.ts';
import { Equipment } from '../interfaces/Equipment.ts';
import { AttackTypes } from '../interfaces/AttackTypes.ts';
import { AttackJson } from '../interfaces/AttackJson.ts';
import { Luck } from '../interfaces/Luck.ts';
import { Percentages } from '../interfaces/Percentages.ts';
import { ATTACK_TYPES } from '../constants/combatRules.ts';
import { ReducedDefender } from '../interfaces/ReducedDefender.ts';
import { ReducedAttacker } from '../interfaces/ReducedAttacker.ts';
import { Attribute } from '../interfaces/Attribute.ts';
import { FumbleDamage, Fumble } from '../interfaces/Fumble.ts';

export const adjustAtributes = (player: Player) => {

  const attributes = Object.keys(player.attributes) as (keyof Player['attributes'])[];

  attributes.forEach((key) => {
    // Every attribute has to be rounded to integer
    player.attributes[key] = Math.round(player.attributes[key] as number);
    // Remaining attributes will have a minimum value of 1
    if (key !== 'insanity' && key !== 'attack') {
      player.attributes[key] = Math.max(1, player.attributes[key] as number);
      //INS: min 1 - max 80
    } 
    if (key === 'insanity' || key === 'CFP') {
      player.attributes[key] = Math.max(1, Math.min(80, player.attributes[key] as number));
    }
  });
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
  const insMod = getInsanityModificator(playerInsanity);
  return Math.min(75,weaponBasePercentage + Math.ceil(playerDexterity / 2) + insMod);
};

export const getFumblePercentage = (playerCFP: number, successPercentage: number) => {
  return Math.floor((100 - successPercentage) * playerCFP / 100);
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

export const getNormalHitDamage = (weaponRoll: number, attackAttribute: number, targetEquipment: Equipment, targetDefenseAttribute: number, attMod2IncreaseRate: number = 0) : number => {
  const attackMod1 = getAttackModificator1(attackAttribute);
  const attackMod2 = getAttackModificator2(attackAttribute);
  const equipmentDefense = getEquipmentDefense(targetEquipment);
  const totalDefense = calculateTotalDefense(equipmentDefense, targetDefenseAttribute);
  const defenseMod = getDefenseModificator(totalDefense);
  const attackMod2Increase = attackMod2 * attMod2IncreaseRate;
  return calculateNormalHitDamage(weaponRoll, attackMod1, attackMod2 + attackMod2Increase, defenseMod);
};

// ---- MAIN FLOW FUNCTION ---- // 

export const getAttackType = (attackRoll: number, successPercentage: number, criticalPercentage: number, fumblePercentage: number) : string => {

  let attackType: AttackTypes;

  if (attackRoll <= criticalPercentage) {
    attackType = ATTACK_TYPES.CRITICAL;
  } else if (attackRoll <= successPercentage) {
    attackType = ATTACK_TYPES.NORMAL;
  } else if (attackRoll <= 100 - fumblePercentage) {
    attackType = ATTACK_TYPES.FAILED;
  } else {
    attackType = ATTACK_TYPES.FUMBLE;
  }

  return attackType;

};

export const attack = (target: ReducedDefender, attacker: ReducedAttacker, attackRoll: number, successPercentage: number, criticalPercentage: number, fumblePercentage: number, weaponRoll: number) => {

  const attackType = getAttackType(attackRoll, successPercentage, criticalPercentage, fumblePercentage);
  let dealedDamage: number = 0;

  switch (attackType) {
  case ATTACK_TYPES.CRITICAL:
    dealedDamage = getCriticalHitDamage(attacker.attributes.BCFA, weaponRoll, attackRoll, criticalPercentage);
    break;
  case ATTACK_TYPES.NORMAL:
    dealedDamage = getNormalHitDamage(weaponRoll, attacker.attributes.attack, target.equipment, target.attributes.defense);
    break;
  case ATTACK_TYPES.FAILED:
    dealedDamage = 0;
    break;
  case ATTACK_TYPES.FUMBLE:
    dealedDamage = 0;
    break;
  }

  return { dealedDamage, attackType };
};

export const parseAttackData = (targetPlayerId: string,
  targetAttributes: Attribute,
  percentages: Percentages,
  attackRoll: number,
  dealedTargetDamage: FumbleDamage | null,
  attackType: string,
  attackerLuckResult?: Luck, 
  defenderLuckResult?: Luck, 
  fumble?: Fumble 
// eslint-disable-next-line function-paren-newline
): AttackJson => {
  const attackJson: AttackJson = {
    attack: {
      targetPlayerId: targetPlayerId,
      attributes: targetAttributes,
      percentages: percentages,
      dieRoll: attackRoll,
      dealedDamage: dealedTargetDamage,
      attackType: attackType
    },
  };

  if (attackType !== ATTACK_TYPES.FUMBLE && attackerLuckResult && defenderLuckResult) {
    attackJson.luck = {
      attacker: {
        hasLuck: attackerLuckResult.hasLuck,
        luckRolls: attackerLuckResult.luckRolls,
        luckRollMessage: attackerLuckResult.luckMessage,
      },
      defender: {
        hasLuck: defenderLuckResult.hasLuck,
        luckRolls: defenderLuckResult.luckRolls,
        luckRollMessage: defenderLuckResult.luckMessage
      }
    };
  } else if (fumble) {
    attackJson.fumble = fumble;
  }

  return attackJson;
};