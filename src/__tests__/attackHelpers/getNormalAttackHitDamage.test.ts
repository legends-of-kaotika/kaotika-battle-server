import { getNormalHitDamage } from '../../helpers/attack.ts';

describe('getNormalHitDamage', () => {

  it('should calculate the normal hit damage correctly', () => {
    expect(getNormalHitDamage(50, 1.25, 15, 2)).toBe(39);
    expect(getNormalHitDamage(25, 1.15, 10, 2)).toBe(20);
    expect(getNormalHitDamage(60, 1, 4, 2)).toBe(32);
    expect(getNormalHitDamage(10, 0.8, 0, 2)).toBe(4);
  });

  it('should handle negative values correctly', () => {
    expect(getNormalHitDamage(-10, 1.25, 15, 2)).toBe(2);
  });

  it('handle zero values correctly', () => {
    expect(getNormalHitDamage(0, 0, 0, 0)).toBe(1);
  });
  
});
