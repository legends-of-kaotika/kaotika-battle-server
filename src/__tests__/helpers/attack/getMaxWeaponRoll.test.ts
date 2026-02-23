import { getMaxWeaponDieRoll } from '../../../helpers/attack.ts';

const weaponDieFacesMock = 100;
const weaponDieNumberMock = 1;
const weaponDieModifierMock = 5;

describe('getWeaponDieRoll method', ()=> {
  it('should return the correct value of the specific weapon', ()=> {
    const weaponRoll = getMaxWeaponDieRoll(weaponDieNumberMock, weaponDieFacesMock, weaponDieModifierMock);
    expect(weaponRoll).toBe(105);
  });
});