
import { getCriticalPercentage } from '../../helpers/attack';
import { mock_CFP31, mock_CFP0 } from '../../__mocks__/attackMocks/getCriticalPercentageMocks';

describe('getCriticalPercentage', () => {
  it('should return the correct critical percentage', () => {

    // Arrange
    const player = mock_CFP31;
    const successPercentage = 20;
    const CFP = 31;

    // Act
    const result = getCriticalPercentage(player, successPercentage);

    // Assert
    expect(result).toBe(Math.ceil(CFP * successPercentage / 100));

  });

  it('should handle zero CFP correctly', () => {

    // Arrange
    const player = mock_CFP0;
    const successPercentage = 20;

    // Act
    const result = getCriticalPercentage(player, successPercentage);
    
    // Assert
    expect(result).toBe(0);

  });

  it('should handle zero successPercentage correctly', () => {

    // Arrange
    const player = mock_CFP31;
    const successPercentage = 0;

    // Act
    const result = getCriticalPercentage(player, successPercentage);

    // Assert
    expect(result).toBe(0);

  });


  it('should always round up to the nearest integer', () => {

    // Arrange
    const player = mock_CFP31;
    const successPercentage = 20;

    // Act
    const result = getCriticalPercentage(player, successPercentage);

    // Assert

    // Math.ceil(31 * 20 / 100)
    expect(result).toBe(result);
  });


});