import { getFumbleEffect } from '../../../helpers/fumble.ts';

const fumblePercentileMock = 40;

describe('getFumbleEffect method', ()=> {
  it('should return the correct fumbleEffect', ()=> {
    const fumbleEffect = getFumbleEffect(fumblePercentileMock);
    expect(fumbleEffect).toBe('lightsmash');
  });

  it('should not crash on NaN percentile', ()=> {
    const fumbleEffect = getFumbleEffect(NaN);
    expect(fumbleEffect).toBe('hack');
  });
});