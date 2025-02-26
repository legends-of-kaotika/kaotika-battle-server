import { Player } from '../../../interfaces/Player.ts';
import { GAME_USERS_MOCK } from '../../../__mocks__/players.ts';
import { GAME_USERS } from '../../../game.ts';
import { selectKaotikaPlayerRandom } from '../../../helpers/npc.ts';

describe('selectKaotikaPLayerRandom', () => {

  test('return undefined when GAME_USERS is empty', () => {
    expect(selectKaotikaPlayerRandom()).toBeUndefined();
  });

  test('returns undefined when all are dravocar', () => {
    const dravocar1: Player = GAME_USERS_MOCK[0];
    const dravocar2: Player = GAME_USERS_MOCK[1];
    GAME_USERS.push(dravocar1, dravocar2);
    expect(selectKaotikaPlayerRandom()).toBeUndefined();
  });

  test('returns the only kaotika player', () => {
    const kaotika: Player = GAME_USERS_MOCK[2];
    const dravocar: Player = GAME_USERS_MOCK[0];
    GAME_USERS.push(kaotika, dravocar);
    expect(selectKaotikaPlayerRandom()).toEqual(kaotika);
  });

  test('returns a random kaotika player', () => {
    const kaotika1: Player = GAME_USERS_MOCK[2];
    const kaotika2: Player = GAME_USERS_MOCK[2];
    const dravocar: Player   = GAME_USERS_MOCK[0];
    GAME_USERS.push(kaotika1, kaotika2, dravocar);

    jest.spyOn(Math, 'random').mockReturnValue(0.9);
    expect(selectKaotikaPlayerRandom()).toEqual(kaotika2);
  });
});