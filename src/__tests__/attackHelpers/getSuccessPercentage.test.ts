import { getSuccessPercentage } from '../../helpers/attack.ts';

describe ('getSuccessPercentage method', ()=> {
  it ('should return the correct successPercentage', ()=> {
    expect(getSuccessPercentage(15, 30, 85)).toBe(42);
    expect(getSuccessPercentage(25, 25, 1)).toBe(38);
    expect(getSuccessPercentage(25, 322, 1)).toBe(75);
  });
});