import { getCriticalHitDamage } from '../../../helpers/attack.ts';
import { gamePlayerMock } from './../../../__mocks__/game/gamePlayerMock.ts';

describe('getCriticalHitDamage', () => {
  it('should calculate the critical hit damage correctly', () => {
    const result1 = getCriticalHitDamage(50, 10, 75, 9, gamePlayerMock.equipment.weapon);
    const result2 = getCriticalHitDamage(100, 50, 75, 9, gamePlayerMock.equipment.weapon);
    const result3 = getCriticalHitDamage(86, 80, 75, 9, gamePlayerMock.equipment.weapon);
    expect(result1).toBeGreaterThanOrEqual(153);
    expect(result1).toBeLessThanOrEqual(650);
    expect(result2).toBeGreaterThanOrEqual(203);
    expect(result2).toBeLessThanOrEqual(700);
    expect(result3).toBeGreaterThanOrEqual(189);
    expect(result3).toBeLessThanOrEqual(686);
  });

  it('should add more weapon throws the rarer the critical is', () => {
    const rareCriticals = Array.from({ length: 200 }, () =>
      getCriticalHitDamage(50, 100, 75, 3, gamePlayerMock.equipment.weapon),);
    const rareAverage = rareCriticals.reduce((total, damage) => total + damage, 0) / rareCriticals.length;
    const commonCritical = getCriticalHitDamage(50, 0, 75, 60, gamePlayerMock.equipment.weapon);
    expect(rareAverage).toBeGreaterThanOrEqual(300);
    expect(commonCritical).toBe(150);
  });

  it('should handle min values correctly', () => {
    expect(getCriticalHitDamage(0, 0, 1, 1, gamePlayerMock.equipment.weapon)).toBe(100); //returns only the weaponDieRoll
    expect(getCriticalHitDamage(0, 0, 0, 0, gamePlayerMock.equipment.weapon)).toBe(100);
  });
});
