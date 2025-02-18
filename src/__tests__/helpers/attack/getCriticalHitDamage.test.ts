import { getCriticalHitDamage } from '../../../helpers/attack.ts';

describe('getCriticalHitDamage', () => {
  it('should calculate the critical hit damage correctly', () => {
    expect(getCriticalHitDamage(50, 20, 15, 25)).toBe(24);
    expect(getCriticalHitDamage(100, 40, 30, 40)).toBe(31);
    expect(getCriticalHitDamage(86, 40, 30, 40)).toBe(29);
  });

  it('should handle min values correctly', () => {
    expect(getCriticalHitDamage(0, 0, 1, 1)).toBe(5);
  });
});
