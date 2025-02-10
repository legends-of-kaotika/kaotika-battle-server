
import { getCriticalPercentage } from '../../helpers/attack.ts';

describe('getCriticalPercentage', () => {
  it('should return the correct critical percentage', () => {
    const cfp = 31;
    const successPercentage = 20;
    const result = getCriticalPercentage(cfp, successPercentage);
    expect(result).toBe(7);
  });

  it('should handle zero CFP correctly', () => {
    const cfp = 0;
    const successPercentage = 20;
    const result = getCriticalPercentage(cfp, successPercentage);
    expect(result).toBe(0);
  });

  it('should handle zero success percentage correctly', () => {
    const cfp = 31;
    const successPercentage = 0;
    const result = getCriticalPercentage(cfp, successPercentage);
    expect(result).toBe(0);
  });


  it('should always round up to the nearest integer', () => {
    const cfp = 31;
    const successPercentage = 20;
    const result = getCriticalPercentage(cfp, successPercentage);
    // 31 * 20 / 100 = 6.2 
    expect(result).toBe(7);
  });


});