import { getInsanityModificator } from '../../helpers/attack';

// ----INS MOD RESULTS---- //
// 95-100 = 15
// 90-94 = 10
// 85-89 = 7
// 80-84 = 5
// 35-79 = 0
// 1-34 = -5

describe('getInsanityModificator',() =>{
  it('should return the rigth percentage of modificator ', () => {
    expect(getInsanityModificator(2)).toBe(-5);
    expect(getInsanityModificator(38)).toBe(0);
    expect(getInsanityModificator(84)).toBe(5);
    expect(getInsanityModificator(85)).toBe(7);
    expect(getInsanityModificator(91)).toBe(10);
    expect(getInsanityModificator(97)).toBe(15);
    expect(getInsanityModificator(97)).not.toBe(0);
  });
});