import { getCriticalHitDamage } from '../../../helpers/attack.ts';
import { gamePlayerMock } from "./../../../__mocks__/game/gamePlayerMock.ts"

describe('getCriticalHitDamage', () => {
  it('should calculate the critical hit damage correctly', () => {
    const result1 = getCriticalHitDamage(50, 10, 15, 25, gamePlayerMock.equipment.weapon);
    const result2 = getCriticalHitDamage(100, 50, 30, 40, gamePlayerMock.equipment.weapon);
    const result3 = getCriticalHitDamage(86, 80, 30, 40, gamePlayerMock.equipment.weapon);
    expect(result1).toBeGreaterThanOrEqual(150);
    expect(result1).toBeLessThanOrEqual(650);
    expect(result2).toBeGreaterThanOrEqual(200);
    expect(result2).toBeLessThanOrEqual(700);
    expect(result3).toBeGreaterThanOrEqual(186)
    expect(result3).toBeLessThanOrEqual(686);
  });

  it('should handle min values correctly', () => {
    expect(getCriticalHitDamage(0, 0, 1, 1, gamePlayerMock.equipment.weapon)).toBe(100); //returns only the weaponDieRoll
  });
});
