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