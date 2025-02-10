import { getCalculationFumbleDamage } from '../../../helpers/fumble.ts';

const bcfaMock = 100;
const weaponDieRollMock = 80;

describe ('getCalculationFumbleDamage method', ()=> {
  it('should return the correct amount of the method', ()=> {
    const fumbleDamage = getCalculationFumbleDamage(bcfaMock, weaponDieRollMock);
    expect(fumbleDamage).toBe(36);
  });
});