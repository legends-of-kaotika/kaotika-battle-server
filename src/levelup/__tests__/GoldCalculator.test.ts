import { charismaScore, updateGoldInLevel } from '../GoldCalculator.ts';

const basePlayer = {
  attributes: {
    intelligence: 10,
    dexterity: 1,
    insanity: 0,
    charisma: 20,
    constitution: 1,
    strength: 1,
  },
};

describe('GoldCalculator', () => {
  it('should map charisma to CHS table values', () => {
    expect(charismaScore(1)).toBe(1);
    expect(charismaScore(7)).toBe(6);
    expect(charismaScore(24)).toBe(14);
    expect(charismaScore(30)).toBe(15);
  });

  it('should award at least base gold per level', () => {
    const gold = updateGoldInLevel(basePlayer, 1);
    expect(gold).toBeGreaterThanOrEqual(2000);
  });

  it('should scale gold with level', () => {
    const low = updateGoldInLevel(basePlayer, 1);
    const high = updateGoldInLevel(basePlayer, 5);
    expect(high).toBeGreaterThanOrEqual(low);
  });

  it('should never return negative gold', () => {
    const player = {
      attributes: { ...basePlayer.attributes, intelligence: -10, charisma: -5 },
    };
    expect(updateGoldInLevel(player, 1)).toBeGreaterThanOrEqual(0);
  });
});
