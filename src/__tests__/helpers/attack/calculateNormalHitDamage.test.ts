import { calculateNormalHitDamage } from '../../../helpers/attack.ts';
import { playerMock } from '../../../__mocks__/players.ts';

describe('calculateNormalHitDamage', () => {

  it('should calculate the normal hit damage correctly', () => {
    expect(calculateNormalHitDamage(50, playerMock.attributes.attack, 5)).toBe(4);
    expect(calculateNormalHitDamage(70, playerMock.attributes.attack, 2.6)).toBe(16);
    expect(calculateNormalHitDamage(35, playerMock.attributes.attack, 0.25)).toBe(20);
    expect(calculateNormalHitDamage(80, playerMock.attributes.attack, 3.1)).toBe(17);
  });

  it('should handle negative attack attribute correctly', () => {
    expect(calculateNormalHitDamage(1, -10, 0.25)).toBe(1);
  });

  it('should handle attack attribute with value of 0 correctly', () => {
    expect(calculateNormalHitDamage(1, 0, 0.25)).toBe(4);
  });
  
});
