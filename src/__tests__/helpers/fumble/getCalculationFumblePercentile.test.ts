import { getCalculationFumblePercentile } from '../../../helpers/fumble.ts';

const fumblePercentageMock = 70;
const attackRollMock = 80;

describe ('getCalculationFumblePercentile method', ()=> {
  it('should return correct amount of the method', ()=> {
    const fumblePercentile = getCalculationFumblePercentile(fumblePercentageMock, attackRollMock);
    expect(fumblePercentile).toBe(34);
  });
});