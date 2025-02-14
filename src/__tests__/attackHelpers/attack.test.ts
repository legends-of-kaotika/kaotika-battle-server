import { attack, getAttackType } from './../../helpers/attack.ts'; 
import { ATTACK_TYPES } from './../../constants/combatRules.ts'; 
import { ONLINE_USERS_MOCK } from '../../__mocks__/players.ts';

jest.mock('./../../helpers/attack.ts', () => ({
  ...jest.requireActual('./../../helpers/attack.ts'),
  getAttackType: jest.fn()
}));

describe('attack function', () => {
  const attacker = ONLINE_USERS_MOCK[0];
  const target = ONLINE_USERS_MOCK[1];
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('returns critical hit damage when attack type is CRITICAL', () => {
    (getAttackType as jest.Mock).mockReturnValue(ATTACK_TYPES.CRITICAL);
    const result = attack(target, attacker, 5, 80, 10, 5);
    expect(result).toEqual({ dealedDamage: 36, attackType: ATTACK_TYPES.CRITICAL });
  });

  test('returns normal hit damage when attack type is NORMAL', () => {
    (getAttackType as jest.Mock).mockReturnValue(ATTACK_TYPES.NORMAL);
    const result = attack(target, attacker, 5, 80, 10, 15);
    expect(result).toEqual({ dealedDamage: 20, attackType: ATTACK_TYPES.NORMAL });
  });

  test('returns zero damage when attack type is FAILED', () => {
    (getAttackType as jest.Mock).mockReturnValue(ATTACK_TYPES.FAILED);
    const result = attack(target, attacker, 90, 80, 10, 15);
    expect(result).toEqual({ dealedDamage: 0, attackType: ATTACK_TYPES.FAILED });
  });

  test('returns zero damage when attack type is FUMBLE', () => {
    (getAttackType as jest.Mock).mockReturnValue(ATTACK_TYPES.FUMBLE);
    const result = attack(target, attacker, 99, 80, 10, 15);
    expect(result).toEqual({ dealedDamage: 0, attackType: ATTACK_TYPES.FUMBLE });
  });
});