import { Player } from '../interfaces/Player';


export const getCriticalPercentage = (player: Player, successPercentage: number) => {
  return Math.ceil(player.attributes.CFP*successPercentage/100);
};