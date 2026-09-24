import { calculateLevelUp } from '../LevelUpCalculator.ts';

describe('calculateLevelUp', () => {
  it('should not level up when XP stays below threshold', () => {
    const result = calculateLevelUp({ experience: 0, level: 1 }, 1749);
    expect(result).toEqual({ newXP: 1749, newLevel: 1, numOfLevelsToAdd: 0, isLevelUp: false });
  });

  it('should level up when XP reaches the next level threshold', () => {
    const result = calculateLevelUp({ experience: 0, level: 1 }, 1750);
    expect(result).toEqual({ newXP: 1750, newLevel: 2, numOfLevelsToAdd: 1, isLevelUp: true });
  });

  it('should support multiple level ups at once', () => {
    const result = calculateLevelUp({ experience: 0, level: 1 }, 5250);
    expect(result.newLevel).toBe(4);
    expect(result.numOfLevelsToAdd).toBe(3);
    expect(result.isLevelUp).toBe(true);
  });

  it('should floor fractional XP', () => {
    const result = calculateLevelUp({ experience: 0, level: 1 }, 1749.9);
    expect(result.newXP).toBe(1749);
    expect(result.isLevelUp).toBe(false);
  });
});
