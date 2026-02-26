import { getSuccessPercentage } from '../../../helpers/attack.ts';

describe ('getSuccessPercentage method', ()=> {
  it ('should return the correct successPercentage', ()=> {
    expect(getSuccessPercentage(15, 30, 85, 60)).toBe(28);
    expect(getSuccessPercentage(25, 25, 1, 30)).toBe(43);
    expect(getSuccessPercentage(25, 40, 1, 1)).toBe(46);
  });
});