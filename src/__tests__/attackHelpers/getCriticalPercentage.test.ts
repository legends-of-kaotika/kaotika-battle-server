
import { getCriticalPercentage } from '../../helpers/attack';
import { mock_CFP31, mock_CFP0 } from '../../__mocks__/attackMocks/getCriticalPercentageMocks';

describe('getCriticalPercentage', () => {
  it('should return the correct critical percentage', () => {
    const player = mock_CFP31;
    const successPercentage = 20;
    const result = getCriticalPercentage(player, successPercentage);
    expect(result).toBe(7);
  });

  it('should handle zero CFP correctly', () => {
    const player = mock_CFP0;
    const successPercentage = 20;
    const result = getCriticalPercentage(player, successPercentage);
    expect(result).toBe(0);
  });

  it('should handle zero success percentage correctly', () => {
    const player = mock_CFP31;
    const successPercentage = 0;
    const result = getCriticalPercentage(player, successPercentage);
    expect(result).toBe(0);
  });


  it('should always round up to the nearest integer', () => {
    const player = mock_CFP31;
    const successPercentage = 20;
    const result = getCriticalPercentage(player, successPercentage);
    // 31 * 20 / 100 = 6.2 
    expect(result).toBe(7);
  });


});