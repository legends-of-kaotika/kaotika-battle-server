import { getNormalHitDamage } from '../../helpers/attack.ts';

import { playerMock } from '../../__mocks__/players.ts';

describe('getNormalHitDamage', () => {

  it('should calculate the normal hit damage correctly', () => {
    expect(getNormalHitDamage(20, 45, playerMock.equipment, playerMock.attributes.defense)).toBe(20);
    expect(getNormalHitDamage(40, 61, playerMock.equipment, playerMock.attributes.defense)).toBe(33);
    expect(getNormalHitDamage(0, 0, playerMock.equipment, playerMock.attributes.defense)).toBe(2);
  });

  it('should handle the attMod2IncreaseRate correctly', () => {
    expect(getNormalHitDamage(20, 45, playerMock.equipment, playerMock.attributes.defense, 0.8)).toBe(26);
    expect(getNormalHitDamage(40, 61, playerMock.equipment, playerMock.attributes.defense, 0.8)).toBe(39);
    expect(getNormalHitDamage(0, 0, playerMock.equipment, playerMock.attributes.defense, 0.5)).toBe(3);
  });

});
