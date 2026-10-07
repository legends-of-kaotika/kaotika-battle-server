import { getCriticalAttackModifier1, getCriticalAttackModifier2 } from '../../../helpers/attack.ts';

describe('getCriticalAttackModifier1',() =>{
  it('should return the rigth value of modificator1 ', () => {
    expect(getCriticalAttackModifier1(100,6)).toBe(5);
    expect(getCriticalAttackModifier1(100,12)).toBe(3);
    expect(getCriticalAttackModifier1(100,20)).toBe(2);
    expect(getCriticalAttackModifier1(100,35)).toBe(2);
    expect(getCriticalAttackModifier1(100,50)).toBe(1);
    expect(getCriticalAttackModifier1(100,70)).toBe(0);
    expect(getCriticalAttackModifier1(75,9)).toBe(3);
  });

  it('should return no extra throws when there is no success or no critical range', () => {
    expect(getCriticalAttackModifier1(0,10)).toBe(0);
    expect(getCriticalAttackModifier1(75,0)).toBe(0);
  });
});
describe('getCriticalAttackModifier2',() =>{
  it('should return the rigth value of modificator1 ', () => {
    expect(getCriticalAttackModifier2(100,6)).toBe(0);
    expect(getCriticalAttackModifier2(100,12)).toBe(2);
    expect(getCriticalAttackModifier2(100,20)).toBe(1);
    expect(getCriticalAttackModifier2(100,35)).toBe(0);
    expect(getCriticalAttackModifier2(100,50)).toBe(0);
    expect(getCriticalAttackModifier2(100,70)).toBe(0);
    expect(getCriticalAttackModifier2(75,9)).toBe(2);
  });

  it('should return no extra throws when there is no success or no critical range', () => {
    expect(getCriticalAttackModifier2(0,10)).toBe(0);
    expect(getCriticalAttackModifier2(75,0)).toBe(0);
  });
});
