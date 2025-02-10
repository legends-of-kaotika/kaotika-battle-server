import { Player } from '../interfaces/Player';
import { Die100 } from '../constants/constants';


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


export const luckRolls = (charisma: number): number[] => {

  const rollTimes = Math.floor(charisma / 20);
  const luckRolls: number[] = [];

  for (let i = 0; i < rollTimes; i++) {
    const roll = Die100.roll();
    luckRolls.push(roll);
    if (roll < 20) {
      // If a throw is successful, the player is already lucky, so no further throws are needed.
      break;
    }
  }

  return luckRolls;
};
