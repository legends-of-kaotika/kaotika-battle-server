import { Die100 } from '../constants/dies.ts';
import Die from '../classes/Die.ts';
import { defenseRules } from '../constants/combatRules.ts';
import { Player } from '../interfaces/Player.ts';
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