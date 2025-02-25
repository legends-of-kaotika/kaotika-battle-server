import { ONLISE_USERS_MOCK_PLAYER } from '../../../__mocks__/helpers/player/__playerMock__.ts';
import { isPlayerAlive } from '../../../helpers/player.ts';

jest.mock('../../../game', () => ({
  GAME_USERS: ONLISE_USERS_MOCK_PLAYER,
}));

describe('test isPlayerConnectedById method', () => {
  it('should return true if find the id in GAME_USERS', () => {
    const isConnected = isPlayerAlive('66decc4ff42d4a193db77e11');
    expect(isConnected).toBe(true);
  });

  it('should return false if not find the id in GAME_USERS', () => {

    const isConnected = isPlayerAlive('1230912389132');
    expect(isConnected).toBe(false);
  });
});