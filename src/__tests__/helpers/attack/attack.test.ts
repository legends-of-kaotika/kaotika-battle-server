import { GAME_USERS_MOCK } from '../../../__mocks__/players.ts';
import { ATTACK_TYPES } from '../../../constants/combatRules.ts';
import { attack } from '../../../helpers/attack.ts';

jest.mock('./../../../helpers/attack.ts', () => ({
  ...jest.requireActual('./../../../helpers/attack.ts'),
  getAttackType: jest.fn()
}));

describe('attack function', () => {
  const attacker = {
  attributes: {
    BCFA: GAME_USERS_MOCK[0].base_attributes.BCFA,
    attack: GAME_USERS_MOCK[0].base_attributes.attack,
    charisma: GAME_USERS_MOCK[0].base_attributes.charisma
  },
  weapon: GAME_USERS_MOCK[0].equipment.weapon
};

  const target = GAME_USERS_MOCK[1];
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('returns critical hit damage when attack type is CRITICAL with correct damage', () => {
    const result = attack(target, attacker, 5, 80, 10, 10, 5);
    expect(result.dealedDamage).toBeGreaterThanOrEqual(213);
    expect(result.dealedDamage).toBeLessThanOrEqual(713);
    expect(result.attackType).toBe(ATTACK_TYPES.CRITICAL);
  });

  test('returns normal hit damage when attack type is NORMAL with correct damage', () => {
    const result = attack(target, attacker, 15, 80, 10, 10, 15);
    expect(result).toEqual({ dealedDamage: 1, attackType: ATTACK_TYPES.NORMAL });
  });
  test('returns critical hit damage when attack type is CRITICAL with correct damage', () => {
    const result = attack(target, attacker, 1, 80, 10, 10, 95);
    expect(result.attackType).toBe(ATTACK_TYPES.CRITICAL);
    expect(result.dealedDamage).toBeGreaterThanOrEqual(213);
    expect(result.dealedDamage).toBeLessThanOrEqual(713);
  });
  test('returns zero damage when attack type is FAILED', () => {
    const result = attack(target, attacker, 90, 80, 10, 10, 15);
    expect(result).toEqual({ dealedDamage: 0, attackType: ATTACK_TYPES.FAILED });
  });

  test('returns zero damage when attack type is FUMBLE', () => {
    const result = attack(target, attacker, 99, 80, 10, 10, 15);
    expect(result).toEqual({ dealedDamage: 0, attackType: ATTACK_TYPES.FUMBLE });
  });
});