import { getFumbleEffect } from '../../../helpers/fumble.ts';

const fumblePercentileMock = 40;

describe('getFumbleEffect method', ()=> {
  it('should return the correct fumbleEffect', ()=> {
    const fumbleEffect = getFumbleEffect(fumblePercentileMock);
    expect(fumbleEffect).toBe('lightsmash');
  });
});