/* eslint-disable @typescript-eslint/no-require-imports */

import { playerMock } from '../../../__mocks__/players.ts';
import { LUCK_MESSAGE } from '../../../constants/messages.ts';
import { applyAttackLuck, attackerLuck, hasLuck, luckRolls } from '../../../helpers/luck.ts';
import { AttackTypes } from '../../../interfaces/AttackTypes.ts';
import { Player } from '../../../interfaces/Player.ts';

jest.spyOn(require('../../../helpers/luck'), 'luckRolls').mockImplementation(() => [10, 15]);
jest.spyOn(require('../../../helpers/luck'), 'hasLuck').mockImplementation(() => true);
jest.spyOn(require('../../../helpers/luck'), 'applyAttackLuck').mockImplementation(() => ({
  dealedDamage: 150,
  luckMessage: 'Critical hit!',
}));

describe('attackerLuck function', () => {
  const attacker = { ...playerMock };
  const defender: Player = { ...playerMock, _id: '213412' };

  const baseDealedDamage = 100;
  const attackType: AttackTypes = 'NORMAL';
  const weaponRoll = 5;
  const attackPercentage = 50;
  const criticalPercentage = 20;

  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  it('should apply attack luck when attacker has luck', () => {
    (luckRolls as jest.Mock).mockReturnValue([10, 15]);
    (hasLuck as jest.Mock).mockReturnValue(true);
    (applyAttackLuck as jest.Mock).mockReturnValue({
      dealedDamage: 150,
      luckMessage: 'Critical hit!',
    });

    const result = attackerLuck(attacker, defender, baseDealedDamage, attackType, weaponRoll, attackPercentage, criticalPercentage);

    expect(luckRolls).toHaveBeenCalledWith(attacker.attributes.charisma);
    expect(hasLuck).toHaveBeenCalledWith([10, 15]);
    expect(applyAttackLuck).toHaveBeenCalledWith(baseDealedDamage, attackType, weaponRoll, attackPercentage, criticalPercentage, attacker, defender);
    expect(result).toEqual({
      hasLuck: true,
      luckRolls: [10, 15],
      dealedDamage: 150,
      luckMessage: 'Critical hit!',
    });
  });

  it('should not apply attack luck when attacker does not have luck', () => {
    (luckRolls as jest.Mock).mockReturnValue([25, 30]);
    (hasLuck as jest.Mock).mockReturnValue(false);

    const result = attackerLuck(attacker, defender, baseDealedDamage, attackType, weaponRoll, attackPercentage, criticalPercentage);

    expect(luckRolls).toHaveBeenCalledWith(attacker.attributes.charisma);
    expect(hasLuck).toHaveBeenCalledWith([25, 30]);
    expect(applyAttackLuck).not.toHaveBeenCalled();
    expect(result).toEqual({
      hasLuck: false,
      luckRolls: [25, 30],
      dealedDamage: baseDealedDamage,
      luckMessage: LUCK_MESSAGE.ATTACKER_NO_LUCK,
    });
  });
});
