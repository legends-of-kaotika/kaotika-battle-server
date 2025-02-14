import { removePlayerFromConectedUsersById } from '../../helpers/player.ts';
import { ONLINE_USERS } from '../../game.ts';
import { GAME_ONLINE_USERS_MOCK } from '../../__mocks__/game/gamePlayerMock.ts';

describe('Test removePlayerFromConectedUsersById', () => {
  beforeEach(() => {
    ONLINE_USERS.splice(0, ONLINE_USERS.length, ...GAME_ONLINE_USERS_MOCK);
  });

  it('should remove correctly from the ONLINE_USERS array', () => {
    removePlayerFromConectedUsersById('12345');
    expect(ONLINE_USERS).toHaveLength(3);
    expect(ONLINE_USERS.find(player => player._id === '12345')).toBeUndefined();
  });
});
