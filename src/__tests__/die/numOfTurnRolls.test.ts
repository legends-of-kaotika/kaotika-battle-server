import { getNumOfTurnRolls } from '../../helpers/player.ts';

const charismaMock = 80;
const dexterityMock = 40;

describe ('numOfTurnRolls method', ()=> {
  it('should return a valid value', ()=> {
    const numDieRolls = getNumOfTurnRolls(charismaMock, dexterityMock);
    expect(numDieRolls).toBe(5);
  });
  it('should at least return 1', ()=> {
    const numDieRolls = getNumOfTurnRolls(1,1);
    expect(numDieRolls).toBe(1);
  });
});