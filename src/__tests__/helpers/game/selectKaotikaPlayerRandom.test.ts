
import { ONLINE_USERS_MOCK } from '../../../__mocks__/players.ts';
import { ONLINE_USERS } from '../../../game.ts';
import { selectKaotikaPlayerRandom } from '../../../helpers/player.ts';
import { Player } from '../../../interfaces/Player.ts';

describe('selectKaotikaPLayerRandom', () => {

  test('return undefined when ONLINE_USERS is empty', () => {
    expect(selectKaotikaPlayerRandom()).toBeUndefined();
  });

  test('returns undefined when all are dravocar', () => {
    const dravocar1: Player = ONLINE_USERS_MOCK[0];
    const dravocar2: Player = ONLINE_USERS_MOCK[1];
    ONLINE_USERS.push(dravocar1, dravocar2);
    expect(selectKaotikaPlayerRandom()).toBeUndefined();
  });

  test('returns the only kaotika player', () => {
    const kaotika: Player = ONLINE_USERS_MOCK[2];
    const dravocar: Player = ONLINE_USERS_MOCK[0];
    ONLINE_USERS.push(kaotika, dravocar);
    expect(selectKaotikaPlayerRandom()).toEqual(kaotika);
  });

  test('returns a random kaotika player', () => {
    const kaotika1: Player = ONLINE_USERS_MOCK[2];
    const kaotika2: Player = ONLINE_USERS_MOCK[2];
    const dravocar: Player   = ONLINE_USERS_MOCK[0];
    ONLINE_USERS.push(kaotika1, kaotika2, dravocar);

    jest.spyOn(Math, 'random').mockReturnValue(0.9);
    expect(selectKaotikaPlayerRandom()).toEqual(kaotika2);
  });
});