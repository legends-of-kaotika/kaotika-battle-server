import { getCalculationFumblePercentile } from '../../../helpers/fumble.ts';

const fumblePercentageMock = 40;
const die100RollMock = 35;

describe ('getCalculationFumblePercentile method', ()=> {
  it('should return correct amount of the method', ()=> {
    const fumblePercentile = getCalculationFumblePercentile(fumblePercentageMock, die100RollMock);
    expect(fumblePercentile).toBe(9);
  });
});