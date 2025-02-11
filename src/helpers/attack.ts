import Die from '../classes/Die.ts';
import { DEFENSE_RULES } from '../constants/combatRules.ts';
import { Die100 } from '../constants/dies.ts';
import { Player } from '../interfaces/Player.ts';
import { ATTACK_RULES_MOD1, ATTACK_RULES_MOD2, INSANITY_RULES } from '../constants/combatRules.ts';

export const adjustAtributes = (player: Player): Player => {

  const attributes = Object.keys(player.attributes) as (keyof Player['attributes'])[];
    
  attributes.forEach((key) => {
    // Every attribute has to be rounded to integer
    player.attributes[key] = Math.round(player.attributes[key] as number);
    // Remaining attributes will have a minimum value of 1
    if (key !== 'insanity' && key !== 'attack') {
      player.attributes[key] = Math.max(1, player.attributes[key] as number);
      //INS: min 1 - max 100
    }else if(key === 'insanity'){
      player.attributes[key] = Math.max(1, Math.min(100, player.attributes[key] as number));
    }
  });
  return player;
};

export const getCriticalPercentage = (CFP: number, successPercentage: number) => {
  return Math.ceil(CFP*successPercentage/100);
};

export const getValueFromRule = (rule:{max: number, value: number}[], findValue:number):number => {
  const {value} = rule.find(({max}) => findValue <= max)!;
  return value;
};

export const getInsanityModificator = (insanity:number) =>{
  return getValueFromRule(INSANITY_RULES,insanity);
};
export const getAttackModificator1 = (attack:number) =>{
  return getValueFromRule(ATTACK_RULES_MOD1,attack);
};
export const getAttackModificator2 = (attack:number) =>{
  return getValueFromRule(ATTACK_RULES_MOD2,attack);
};

export const getAttackRoll = (): number => {
  return Die100.roll();
};

export const getSuccessPercentage = (weaponBasePercentage : number, playerDexterity: number, playerInsanity: number) : number => {
  return weaponBasePercentage + Math.ceil(playerDexterity/3) + playerInsanity;
};

export const getFumblePercentage = (playerCFP: number, successPercentage: number) => {
  return Math.floor(100 -(100 - successPercentage) * playerCFP /100);
};
export const getDefenseModificator = (value: number) : number => {
  return getValueFromRule(DEFENSE_RULES, value);
};

export const calculateTotalDefense = (totalArmorDefense : number, playerDefense: number) : number => {
  return Math.floor(totalArmorDefense + playerDefense);
};

export const getWeaponDieRoll = (weaponDieNumber: number, weaponDieFaces: number, weaponDieModifier: number): number => {
  const weaponDie = new Die(weaponDieNumber, weaponDieFaces, weaponDieModifier);
  return weaponDie.rollWithModifier();
};

export const getCriticalHitDamage = (bcfa: number, weaponRoll: number, critMod1: number, critMod2: number) => {
  return Math.ceil(bcfa/5 + weaponRoll * critMod1 + critMod2);
};
