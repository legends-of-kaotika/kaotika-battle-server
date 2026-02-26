import { ATTACK_TYPES } from '../../../constants/combatRules.ts';
import { getAttackType } from '../../../helpers/attack.ts';

describe('getAttackType', () => {

  it('should return the correct attack type', () => {
    expect(getAttackType(15, 30, 20, 2)).toBe(ATTACK_TYPES.CRITICAL);
    expect(getAttackType(20, 30, 15, 2)).toBe(ATTACK_TYPES.NORMAL);
    expect(getAttackType(15, 10, 5, 50)).toBe(ATTACK_TYPES.FAILED);
    expect(getAttackType(35, 30, 10, 75)).toBe(ATTACK_TYPES.FAILED);
    expect(getAttackType(88, 25, 15, 13)).toBe(ATTACK_TYPES.FUMBLE);
    expect(getAttackType(100, 25, 15, 13)).toBe(ATTACK_TYPES.FUMBLE);
  });

});