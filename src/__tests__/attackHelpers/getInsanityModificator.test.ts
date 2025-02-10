import { INSANITY_RULES } from '../../constants/combatRules.ts';
import { getValueFromRule } from '../../helpers/attack.ts';


describe('getInsanityModificator',() =>{
  it('should return the rigth percentage of modificator ', () => {
    expect(getValueFromRule(INSANITY_RULES,2)).toBe(-5);
    expect(getValueFromRule(INSANITY_RULES,38)).toBe(0);
    expect(getValueFromRule(INSANITY_RULES,84)).toBe(5);
    expect(getValueFromRule(INSANITY_RULES,85)).toBe(7);
    expect(getValueFromRule(INSANITY_RULES,91)).toBe(10);
    expect(getValueFromRule(INSANITY_RULES,97)).toBe(15);
    expect(getValueFromRule(INSANITY_RULES,97)).not.toBe(0);
  });
});