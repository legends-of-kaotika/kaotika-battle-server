import { calculateCriticalHitDamage } from '../../../helpers/attack.ts';
import { gamePlayerMock } from "./../../../__mocks__/game/gamePlayerMock.ts";

describe('calculateCriticalHitDamage', () => {

  it('should calculate the critical hit damage correctly', () => {
    const result1 = calculateCriticalHitDamage(10, 5, 2, 1, gamePlayerMock.equipment.weapon);
    const result2 = calculateCriticalHitDamage(25, 30, 1, 0, gamePlayerMock.equipment.weapon);
    const result3 = calculateCriticalHitDamage(0, 0, 0, 0, gamePlayerMock.equipment.weapon);
    const result4 = calculateCriticalHitDamage(50, 80, 5, 0, gamePlayerMock.equipment.weapon)
    expect(result1).toBeGreaterThanOrEqual(110);
    expect(result1).toBeLessThanOrEqual(410);
    expect(result2).toBeGreaterThanOrEqual(125);
    expect(result2).toBeLessThanOrEqual(225);
    expect(result3).toBe(100); 
    expect(result4).toBeGreaterThanOrEqual(150);
    expect(result4).toBeLessThanOrEqual(650);
  });                                                     

  it('should handle negative values correctly', () => {
    const result1 = calculateCriticalHitDamage(-10, 5, 0, 0, gamePlayerMock.equipment.weapon);
    expect(result1).toBe(90); //maxWeaponDIeRoll and bcfa -10
  });


  it('handle zero values correctly', () => {
    expect(calculateCriticalHitDamage(0, 0, 0, 0, gamePlayerMock.equipment.weapon)).toBe(100); //return only maxWeaponDieRoll
  });
  
});
