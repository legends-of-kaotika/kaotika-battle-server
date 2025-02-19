import { calculateNormalHitDamage } from '../../../helpers/attack.ts';

describe('calculateNormalHitDamage', () => {

  it('should calculate the normal hit damage correctly', () => {
    expect(calculateNormalHitDamage(50, 1.25, 15, 2)).toBe(39);
    expect(calculateNormalHitDamage(25, 1.15, 10, 2)).toBe(20);
    expect(calculateNormalHitDamage(60, 1, 4, 2)).toBe(32);
    expect(calculateNormalHitDamage(10, 0.8, 0, 2)).toBe(4);
  });

  it('should handle negative values correctly', () => {
    expect(calculateNormalHitDamage(-10, 1.25, 15, 2)).toBe(2);
  });

  it('handle zero values correctly', () => {
    expect(calculateNormalHitDamage(0, 0, 0, 0)).toBe(1);
  });
  
});
