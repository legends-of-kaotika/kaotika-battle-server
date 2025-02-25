import { GAME_USERS_MOCK } from '../../../__mocks__/players.ts';
import { GAME_USERS } from '../../../game.ts';
import { handlePlayerDeath } from '../../../helpers/player.ts';
import { sendKilledPlayer } from '../../../sockets/emits/user.ts';

jest.mock('../../../sockets/emits/user', () => ({
  sendKilledPlayer: jest.fn()
}));

describe('test handlePlayerDeath function', () => {
  
  beforeEach(() => {
    GAME_USERS.splice(0, GAME_USERS.length, ...GAME_USERS_MOCK);
  });

  it('should remove correctly the player from the array if the id exists', () => {
    handlePlayerDeath('66decc4ff42d4a193db77e11');

    expect(GAME_USERS.some(player => player._id === '66decc4ff42d4a193db77e11')).toBe(false);
    expect(sendKilledPlayer).toHaveBeenCalled();
  });

  it('should not remove any player if the id does not exist', () => {
    handlePlayerDeath('');

    expect(GAME_USERS).toHaveLength(GAME_USERS_MOCK.length);
  });
});