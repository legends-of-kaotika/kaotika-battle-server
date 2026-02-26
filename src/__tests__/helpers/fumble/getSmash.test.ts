import { getSmashDamage } from '../../../helpers/fumble.ts';

describe('smashDamage method', ()=> {
  it('should divide input number by 2, rounded up', ()=> {
    const result = getSmashDamage(5);
    expect(result).toEqual({hit_points: 3});
  });
});