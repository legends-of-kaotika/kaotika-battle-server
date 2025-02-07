import { Player } from '../interfaces/Player';


export const getCriticalPercentage = (player: Player, successPercentage: number) => {
  // Formula: CRIT% = CFP * SUCCESS% / 100 (result rounded up)
  return Math.ceil(player.attributes.CFP*successPercentage/100);
};