import { calculateCriticalHitDamage } from '../../helpers/attack.ts';

describe('calculateCriticalHitDamage', () => {

  it('should calculate the critical hit damage correctly', () => {
    expect(calculateCriticalHitDamage(10, 5, 2, 3)).toBe(15);
    expect(calculateCriticalHitDamage(25, 4, 1.5, 2)).toBe(13);
    expect(calculateCriticalHitDamage(0, 10, 3, 5)).toBe(35); 
    expect(calculateCriticalHitDamage(50, 6, 2, 1)).toBe(23);
  });

  it('should handle negative values correctly', () => {
    expect(calculateCriticalHitDamage(-10, 5, 2, 3)).toBe(11);
    expect(calculateCriticalHitDamage(10, -5, 2, 3)).toBe(-5);
  });

  it('handle zero values correctly', () => {
    expect(calculateCriticalHitDamage(0, 0, 0, 0)).toBe(0);
  });
  
});
