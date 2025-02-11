import { getCriticalHitDamage } from '../../helpers/attack.ts';

describe('getCriticalHitDamage', () => {

  it('should calculate the critical hit damage correctly', () => {
    expect(getCriticalHitDamage(10, 5, 2, 3)).toBe(15);
    expect(getCriticalHitDamage(25, 4, 1.5, 2)).toBe(13);
    expect(getCriticalHitDamage(0, 10, 3, 5)).toBe(35); 
    expect(getCriticalHitDamage(50, 6, 2, 1)).toBe(23);
  });

  it('should handle negative values correctly', () => {
    expect(getCriticalHitDamage(-10, 5, 2, 3)).toBe(11);
    expect(getCriticalHitDamage(10, -5, 2, 3)).toBe(-5);
  });

  it('handle zero values correctly', () => {
    expect(getCriticalHitDamage(0, 0, 0, 0)).toBe(0);
  });
  
});
