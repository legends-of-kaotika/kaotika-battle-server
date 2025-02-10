import { Player } from '../interfaces/Player';

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

export const getCriticalPercentage = (player: Player, successPercentage: number) => {
  // Formula: CRIT% = CFP * SUCCESS% / 100 (result rounded up)
  return Math.ceil(player.attributes.CFP*successPercentage/100);
};