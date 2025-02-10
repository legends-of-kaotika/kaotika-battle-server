import { applyHack} from '../../../helpers/fumble.ts';

const dexMock = 20;

describe('applyHack method', ()=> {
  it('should return correct amount', ()=> {
    const hackResult = applyHack(dexMock);
    expect(hackResult).toBe(10);
  });
  it('should return at least 1', ()=> {
    const hackResult = applyHack(1);
    expect(hackResult).toBe(1);
  });
});