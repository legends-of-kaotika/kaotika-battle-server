
import { hasLuck } from '../../helpers/attack.ts';

describe('hasLuck', () => {

  it('should return true if any number of the array is below 20', () => {
    expect(hasLuck([10, 25, 40])).toBe(true);
  });

  it('should return false if all the numbers of the array are above 20', () => {
    expect(hasLuck([20, 25, 40])).toBe(false);
  });

  it('should return false if the array is empty', () => {
    expect(hasLuck([])).toBe(false);
  });

});