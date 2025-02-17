import { applyScytheDamage } from '../../../helpers/fumble.ts';

const scytheDamageMock = 20;

describe('applyScythe method', ()=> {
  it('should return correct amount', ()=> {
    const scytheResult = applyScytheDamage(scytheDamageMock);
    expect(scytheResult).toEqual({hit_points: 21});
  });
});