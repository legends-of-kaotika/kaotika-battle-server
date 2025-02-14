
import { getFumblePercentage } from '../../../helpers/attack.ts';

describe('getFumblePercentage', () => {

  it('should return the correct Fumble percentage', () => {
    const result = getFumblePercentage(31, 20); // Result 6.2
    expect(result).toBe(6);
  });

  it('should handle zero CFP correctly', () => {
    const result = getFumblePercentage(0, 20);
    expect(result).toBe(0);
  });

  it('should handle zero success percentage correctly', () => {
    const result = getFumblePercentage(31, 0);
    expect(result).toBe(0);
  });

});