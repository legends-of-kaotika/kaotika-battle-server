
import { getFumblePercentage } from '../../../helpers/attack.ts';

describe('getFumblePercentage', () => {

  it('should return the correct Fumble percentage', () => {
    const result = getFumblePercentage(31, 20); // Result 6.2
    expect(result).toBe(24);
  });

  it('should return the correct Fumble percentage', () => {
    const result = getFumblePercentage(80, 75); // Result 20
    expect(result).toBe(20);
  });

  it('should handle zero CFP correctly', () => {
    const result = getFumblePercentage(0, 20);
    expect(result).toBe(0);
  });
});