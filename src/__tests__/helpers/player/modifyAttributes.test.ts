import { ONLISE_USERS_MOCK_PLAYER } from '../../../__mocks__/helpers/player/__playerMock__.ts';
import { modifyAttributes } from '../../../helpers/player.ts';
import { Attribute } from '../../../interfaces/Attribute.ts';

jest.mock('../../../game.ts', () => ({
  ONLINE_USERS: ONLISE_USERS_MOCK_PLAYER
}));


describe('test modifyAttributes function', () => {
  it('should merge the attributes correctly if player exist', () => {
    const newAttributes: Partial<Attribute> = {
      hit_points: 100,
      strength: 20
    };
    modifyAttributes('66decc4ff42d4a193db77e11', newAttributes)!;

    expect(ONLISE_USERS_MOCK_PLAYER[0].attributes.hit_points).toBe(100);
    expect(ONLISE_USERS_MOCK_PLAYER[0].attributes.strength).toBe(20);
    expect(ONLISE_USERS_MOCK_PLAYER[0].attributes).toEqual({
      charisma: 129,
      constitution: 60,
      dexterity: 23,
      insanity: 95,
      intelligence: 29,
      strength: 20,
      resistance: 100,
      attack: -30,
      hit_points: 100,
      defense: 97,
      magic_resistance: 159,
      CFP: 95,
      BCFA: 113
    });
  });

  it('should not modify the attributes and return undefined if the player does not exist in the ONLINE_USERS array', () => {
    const newAttributes: Partial<Attribute> = {
      hit_points: 100,
      strength: 20
    };
    modifyAttributes('66decc4ff42d4a193db77e12', newAttributes);
    
    
  });
});