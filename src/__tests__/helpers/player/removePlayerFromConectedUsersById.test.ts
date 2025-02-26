import { GAME_USERS_MOCK } from '../../../__mocks__/players.ts';
import { GAME_USERS } from '../../../game.ts';
import { removePlayerFromConectedUsersById } from '../../../helpers/player.ts';

describe('Test removePlayerFromConectedUsersById', () => {
  beforeEach(() => {
    GAME_USERS.splice(0, GAME_USERS.length, ...GAME_USERS_MOCK);
  });

  it('should remove correctly from the GAME_USERS array', () => {
    removePlayerFromConectedUsersById('12345');
    expect(GAME_USERS).toHaveLength(3);
    expect(GAME_USERS.find(player => player._id === '12345')).toBeUndefined();
  });
});
