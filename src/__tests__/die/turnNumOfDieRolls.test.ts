import { getTurnNumOfDieRolls } from '../../helpers/player.ts';

const charismaMock = 80;
const dexterityMock = 40;

describe ('turnNumOfDieRolls method', ()=> {
  it('should return a valid value', ()=> {
    const numDieRolls = getTurnNumOfDieRolls(charismaMock, dexterityMock);
    expect(numDieRolls).toBe(5);
  });
  it('should at least return 1', ()=> {
    const numDieRolls = getTurnNumOfDieRolls(1,1);
    expect(numDieRolls).toBe(1);
  });
});