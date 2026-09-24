import { EXPERIENCE_TO_NEXT_LEVEL } from './configs/levelConfig.ts';
import type { LevelUpCalculation } from './types.ts';

export const calculateLevelUp = (player: { experience: number; level: number },
  absoluteXP: number,): LevelUpCalculation => {
  const newXP = Math.floor(absoluteXP);
  const newLevel = Math.floor(newXP / EXPERIENCE_TO_NEXT_LEVEL) + 1;
  const numOfLevelsToAdd = newLevel - player.level;
  return {
    newXP,
    newLevel,
    numOfLevelsToAdd,
    isLevelUp: numOfLevelsToAdd > 0,
  };
};
