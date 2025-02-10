
import { getFumblePercentage } from '../../helpers/attack';
import { mock_CFP31, mock_CFP0 } from '../../__mocks__/attackMocks/testingPlayerMock';

describe('getFumblePercentage', () => {
  it('should return the correct Fumble percentage', () => {
    const player = mock_CFP31;
    const successPercentage = 20;
    const result = getFumblePercentage(player.attributes.CFP, successPercentage);
    expect(result).toBe(75);
  });

  it('should handle zero CFP correctly', () => {
    const player = mock_CFP0;
    const successPercentage = 20;
    const result = getFumblePercentage(player.attributes.CFP, successPercentage);
    expect(result).toBe(100);
  });

  it('should handle zero success percentage correctly', () => {
    const player = mock_CFP31;
    const successPercentage = 0;
    const result = getFumblePercentage(player.attributes.CFP, successPercentage);
    expect(result).toBe(69);
  });


  it('should always round down to the nearest integer', () => {
    const player = mock_CFP31;
    const successPercentage = 20;
    const result = getFumblePercentage(player.attributes.CFP, successPercentage);
    // 100-(100-20)*31/100 = 75.2
    expect(result).toBe(75);
  });
});