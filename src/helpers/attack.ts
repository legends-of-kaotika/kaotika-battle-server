import Die from '../classes/Die.ts';
import { Player } from '../interfaces/Player.ts';


export const getCriticalPercentage = (player: Player, successPercentage: number) => {
  return Math.ceil(player.attributes.CFP*successPercentage/100);
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

export const getAttackRoll = () => {
  const die = new Die(1, 100);
  return die.roll();
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