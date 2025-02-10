
import { getFumblePercentage } from '../../helpers/attack.ts';

describe('getFumblePercentage', () => {
  it('should return the correct Fumble percentage', () => {
    const successPercentage = 20;
    const result = getFumblePercentage(31, successPercentage);
    expect(result).toBe(75);
  });

  it('should handle zero CFP correctly', () => {
    const successPercentage = 20;
    const result = getFumblePercentage(0, successPercentage);
    expect(result).toBe(100);
  });

  it('should handle zero success percentage correctly', () => {
    const successPercentage = 0;
    const result = getFumblePercentage(31, successPercentage);
    expect(result).toBe(69);
  });


  it('should always round down to the nearest integer', () => {
    const successPercentage = 20;
    const result = getFumblePercentage(31, successPercentage);
    // 100-(100-20)*31/100 = 75.2
    expect(result).toBe(75);
  });
});