import { getAttackRoll } from '../../../helpers/attack.ts';

describe ('getAttackRoll method', ()=> {
  it('should return the correct random value of 1D100', ()=> {
    const resultAttackRoll = getAttackRoll();
    expect(resultAttackRoll).toBeGreaterThanOrEqual(1);
    expect(resultAttackRoll).toBeLessThanOrEqual(100);
  });
});