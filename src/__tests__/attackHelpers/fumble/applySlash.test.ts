import { applySlash } from '../../../helpers/fumble.ts';

const fumbleDamageMock = 20;

describe('applySlash method', ()=> {
  it('should return correct amount', ()=> {
    const splashResult = applySlash(fumbleDamageMock);
    expect(splashResult).toBe(10);
  });
  it('should return at least 1', ()=> {
    const splashResult = applySlash(1);
    expect(splashResult).toBe(1);
  });
});