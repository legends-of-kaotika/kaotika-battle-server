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

export const getAttackRoll = (): number => {
  const die = new Die(1, 100);
  return die.roll();
};

export const getSuccessPercentage = (weaponBasePercentage : number, playerDexterity: number, playerInsanity: number) : number => {
  return weaponBasePercentage + Math.ceil(playerDexterity/3) + playerInsanity;
};
export const getFumblePercentage = (playerCFP: number, successPercentage: number) => {
  return Math.floor(100 -(100 - successPercentage) * playerCFP /100);
};