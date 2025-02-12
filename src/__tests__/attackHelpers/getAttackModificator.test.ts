import { getAttackModificator1,getAttackModificator2 } from '../../helpers/attack.ts';


describe('getAttackModificator1',() =>{
  it('should return the rigth value of modificator1 ', () => {
    expect(getAttackModificator1(-22)).toBe(0.8);
    expect(getAttackModificator1(-15)).toBe(0.9);
    expect(getAttackModificator1(-5)).toBe(1);
    expect(getAttackModificator1(19)).toBe(1.1);
    expect(getAttackModificator1(20)).toBe(1.15);
    expect(getAttackModificator1(50)).toBe(1.2);
    expect(getAttackModificator1(187)).toBe(1.25);
  });
});
describe('getAttackModificator1',() =>{
  it('should return the rigth value of modificator1 ', () => {
    expect(getAttackModificator2(-22)).toBe(0);
    expect(getAttackModificator2(-15)).toBe(2);
    expect(getAttackModificator2(-5)).toBe(4);
    expect(getAttackModificator2(19)).toBe(6);
    expect(getAttackModificator2(20)).toBe(10);
    expect(getAttackModificator2(50)).toBe(15);
    expect(getAttackModificator2(187)).toBe(15);
  });
});