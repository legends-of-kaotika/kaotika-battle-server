import { DEFENSE_RULES } from '../../constants/combatRules.ts';
import { getValueFromRule, calculateTotalDefense } from '../../helpers/attack.ts';

describe('test de calculate defense mod' , () => {
  it('should calculate correctly the total defense', () => {
    const totalDefense = calculateTotalDefense(1, 34);

    expect(totalDefense).toBe(35);
  });

  it('should calculate correctly the defense mod', () => {
    const defenseMod = getValueFromRule(DEFENSE_RULES,35);
    expect(defenseMod).toBe(0);
  });
});