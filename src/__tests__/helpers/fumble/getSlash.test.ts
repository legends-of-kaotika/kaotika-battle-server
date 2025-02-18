import { getSlashDamage } from '../../../helpers/fumble.ts';

const fumbleDamageMock = 20;

describe('getSlash method', ()=> {
  it('should return correct amount', ()=> {
    const splashResult = getSlashDamage(fumbleDamageMock);
    expect(splashResult).toEqual({hit_points: 10});
  });
  it('should return at least 1', ()=> {
    const splashResult = getSlashDamage(1);
    expect(splashResult).toEqual({hit_points: 1});
  });
});