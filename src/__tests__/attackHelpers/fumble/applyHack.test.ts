import { applyHackDamage} from '../../../helpers/fumble.ts';

const dexMock = 20;

describe('applyHack method', ()=> {
  it('should return correct amount', ()=> {
    const hackResult = applyHackDamage(dexMock);
    expect(hackResult).toEqual({dexterity: 10});
  });
  it('should return at least 1', ()=> {
    const hackResult = applyHackDamage(1);
    expect(hackResult).toEqual({dexterity: 1});
  });
});