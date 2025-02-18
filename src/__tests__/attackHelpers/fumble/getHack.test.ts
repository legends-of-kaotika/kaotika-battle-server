import { getHackDamage} from '../../../helpers/fumble.ts';

const dexMock = 20;

describe('getHack method', ()=> {
  it('should return correct amount', ()=> {
    const hackResult = getHackDamage(dexMock);
    expect(hackResult).toEqual({dexterity: 10});
  });
  it('should return at least 1', ()=> {
    const hackResult = getHackDamage(1);
    expect(hackResult).toEqual({dexterity: 1});
  });
});