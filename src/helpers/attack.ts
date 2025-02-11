import { Die100 } from '../constants/dies.ts';
import Die from '../classes/Die.ts';
import { defenseRules } from '../constants/combatRules.ts';

export const getCriticalPercentage = (CFP: number, successPercentage: number) => {
  return Math.ceil(CFP*successPercentage/100);
};

export const getInsanityModificator = (insanity:number):number => {
  // ----INS MOD RESULTS---- //
  // 95-100 = 15
  // 90-94 = 10
  // 85-89 = 7
  // 80-84 = 5
  // 35-79 = 0
  // 1-34 = -5

  if ( insanity <= 34 ){ return -5;}
  else if ( insanity <= 79 ){ return 0; }
  else if ( insanity <= 84 ){ return 5; }
  else if ( insanity <= 89 ){ return 7; }
  else if ( insanity <= 94 ){ return 10; }
  else { return 15; }
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

export const calculateDefenseModificator = (totalDefense: number) : number => {
  const { value } = defenseRules.find(({max}) => totalDefense <= max)!;
  return value;
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
