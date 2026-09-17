import { getCalculationFumblePercentile } from '../../../helpers/fumble.ts';

const fumblePercentageMock = 70;
const attackRollMock = 80;

describe ('getCalculationFumblePercentile method', ()=> {
  it('should return correct amount of the method', ()=> {
    const fumblePercentile = getCalculationFumblePercentile(fumblePercentageMock, attackRollMock);
    expect(fumblePercentile).toBe(34);
  });

  it('should not produce NaN when fumble percentage is 100', ()=> {
    const fumblePercentile = getCalculationFumblePercentile(100, 100);
    expect(fumblePercentile).toBe(100);
  });
});