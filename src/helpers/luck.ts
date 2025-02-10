import { Die100 } from '../constants/dies.ts';

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

export const hasLuck = (luckRolls: number[]): boolean => {
  return luckRolls.some(roll => roll<20);
};
