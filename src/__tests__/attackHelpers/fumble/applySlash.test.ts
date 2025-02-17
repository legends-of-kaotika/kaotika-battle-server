import { applySlashDamage } from '../../../helpers/fumble.ts';

const fumbleDamageMock = 20;

describe('applySlash method', ()=> {
  it('should return correct amount', ()=> {
    const splashResult = applySlashDamage(fumbleDamageMock);
    expect(splashResult).toEqual({hit_points: 10});
  });
  it('should return at least 1', ()=> {
    const splashResult = applySlashDamage(1);
    expect(splashResult).toEqual({hit_points: 1});
  });
});