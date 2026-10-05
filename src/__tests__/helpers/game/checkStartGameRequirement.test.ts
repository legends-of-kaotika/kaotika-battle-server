import { GAME_USERS } from '../../../game.ts';
import { checkStartGameRequirement } from '../../../helpers/game.ts';
import { Player } from '../../../interfaces/Player.ts';
import { GAME_USERS_MOCK } from '../../../__mocks__/players.ts';

describe('checkStartGameRequirement', () => {
  afterEach(() => GAME_USERS.splice(0, GAME_USERS.length));

  it('allows an administrator to start with one loyal acolyte', () => {
    const acolyte = JSON.parse(JSON.stringify(GAME_USERS_MOCK[0])) as Player;
    acolyte.role = 'acolyte';
    acolyte.isBetrayer = false;
    GAME_USERS.push(acolyte);

    expect(checkStartGameRequirement()).toBe(true);
  });

  it('accepts legacy loyal acolytes without an explicit betrayer flag', () => {
    const acolyte = JSON.parse(JSON.stringify(GAME_USERS_MOCK[0])) as Player;
    acolyte.role = 'acolyte';
    acolyte.isBetrayer = undefined as unknown as boolean;
    GAME_USERS.push(acolyte);

    expect(checkStartGameRequirement()).toBe(true);
  });

  it('does not count a lone betrayer as the required acolyte', () => {
    const betrayer = JSON.parse(JSON.stringify(GAME_USERS_MOCK[0])) as Player;
    betrayer.role = 'acolyte';
    betrayer.isBetrayer = true;
    GAME_USERS.push(betrayer);

    expect(checkStartGameRequirement()).toBe(false);
  });
});
