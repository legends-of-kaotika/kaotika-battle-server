import { Roll } from './Roll.ts';
import type { LevelUpAttributes } from './types.ts';

const BASE_GOLD = 2000;

const CHS_TABLE: ReadonlyArray<readonly [maxCharisma: number, chs: number]> = [
  [1, 1], [2, 2], [3, 3], [4, 4], [5, 5],
  [7, 6], [9, 7], [11, 8], [14, 9], [17, 10],
  [20, 11], [22, 12], [23, 13], [24, 14],
];

const intRollDie = (intelligence: number): Roll => {
  if (intelligence <= 6) return new Roll(2, 1, 0);
  if (intelligence <= 10) return new Roll(3, 1, 0);
  if (intelligence <= 14) return new Roll(4, 1, 0);
  return new Roll(3, 2, -1);
};

export const charismaScore = (charisma: number): number => {
  for (const [maxCharisma, chs] of CHS_TABLE) {
    if (charisma <= maxCharisma) return chs;
  }
  return 15;
};

const charismaGold = (charisma: number, level: number): number => {
  const chs = charismaScore(charisma);
  const d20 = new Roll(20, 1, 0);
  let total = 0;
  for (let i = 0; i < level; i++) {
    if (d20.execute() <= chs) {
      total += d20.execute() * 50;
    }
  }
  return total;
};

export const updateGoldInLevel = (player: { attributes: LevelUpAttributes },
  level: number,): number => {
  const intDie = intRollDie(player.attributes.intelligence);
  const levelModifier = level * 50 * intDie.execute();
  const charismaModifier = charismaGold(player.attributes.charisma, level);
  return Math.max(0, BASE_GOLD + levelModifier + charismaModifier);
};
