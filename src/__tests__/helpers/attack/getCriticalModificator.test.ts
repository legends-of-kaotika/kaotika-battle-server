import { getCriticalAttackModifier1, getCriticalAttackModifier2 } from '../../../helpers/attack.ts';

describe('getCriticalAttackModifier1',() =>{
  it('should return the rigth value of modificator1 ', () => {
    expect(getCriticalAttackModifier1(2,50)).toBe(5);
    expect(getCriticalAttackModifier1(13,100)).toBe(3);
    expect(getCriticalAttackModifier1(7,30)).toBe(2);
    expect(getCriticalAttackModifier1(10,35)).toBe(2);
    expect(getCriticalAttackModifier1(50,100)).toBe(1);
    expect(getCriticalAttackModifier1(70,100)).toBe(0);
  });
});
describe('getCriticalAttackModifier2',() =>{
  it('should return the rigth value of modificator1 ', () => {
    expect(getCriticalAttackModifier2(2,50)).toBe(0);
    expect(getCriticalAttackModifier2(13,100)).toBe(2);
    expect(getCriticalAttackModifier2(7,30)).toBe(1);
    expect(getCriticalAttackModifier2(10,35)).toBe(0);
    expect(getCriticalAttackModifier2(50,100)).toBe(0);
    expect(getCriticalAttackModifier2(70,100)).toBe(0);
  });
});