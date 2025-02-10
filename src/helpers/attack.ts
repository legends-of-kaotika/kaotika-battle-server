import { Die100 } from '../constants/dies.ts';
import Die from '../classes/Die.ts';

export const getCriticalPercentage = (CFP: number, successPercentage: number) => {
  return Math.ceil(CFP*successPercentage/100);
};

export const getValueFromRule = (rule:{max: number, value: number}[], findValue:number):number => {
  const {value} = rule.find(({max}) => findValue <= max)!; 
  return value;
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
  // ----DEF MOD RESULTS---- //
  // 400 = 7
  // 351-400 = 6
  // 275-350 = 5
  // 201-274 = 4
  // 151-200 = 3
  // 100-150 = 2
  // <100 =  0

  if(totalDefense < 100) return 0;
  else if(totalDefense <= 150) return 2;
  else if(totalDefense <= 200) return 3;
  else if(totalDefense <= 274) return 4;
  else if(totalDefense <= 350) return 5;
  else if(totalDefense <= 400) return 6;
  else return 7;
};

export const calculateTotalDefense = (totalArmorDefense : number, playerDefense: number) : number => {
  return Math.floor(totalArmorDefense + playerDefense);
};

export const getWeaponDieRoll = (weaponDieNumber: number, weaponDieFaces: number, weaponDieModifier: number): number => {
  const weaponDie = new Die(weaponDieNumber, weaponDieFaces, weaponDieModifier);
  return weaponDie.rollWithModifier();
};