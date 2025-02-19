import { getInsanityModificator } from '../../../helpers/attack.ts';


describe('getInsanityModificator',() =>{
  it('should return the rigth percentage of modificator ', () => {
    expect(getInsanityModificator(2)).toBe(0);
    expect(getInsanityModificator(38)).toBe(5);
    expect(getInsanityModificator(84)).toBe(10);
    expect(getInsanityModificator(85)).toBe(12);
    expect(getInsanityModificator(91)).toBe(15);
    expect(getInsanityModificator(97)).toBe(25);
  });
});