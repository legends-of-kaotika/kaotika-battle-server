import { getNormalHitDamage } from '../../../helpers/attack.ts';

import { playerMock } from '../../../__mocks__/players.ts';

describe('getNormalHitDamage', () => {

  it('should calculate the normal hit damage correctly', () => {
    expect(getNormalHitDamage(playerMock.equipment.weapon, 20, 45, playerMock.equipment, playerMock.attributes.defense)).toBe(39);
    expect(getNormalHitDamage(playerMock.equipment.weapon, 40, 61, playerMock.equipment, playerMock.attributes.defense)).toBe(60);
    expect(getNormalHitDamage(playerMock.equipment.weapon, 0, 0, playerMock.equipment, playerMock.attributes.defense)).toBe(1);
  });

});
