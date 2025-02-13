import { GAME_ONLINE_USERS_MOCK, gamePlayerMock } from '../../__mocks__/game/gamePlayerMock.ts';
import { removePlayerFromConectedUsersById } from '../../helpers/player.ts';


describe('test function the removePlayerFromOnline associated to handlePlayerDeath', () => {

  it('should remove correctly from the ONLINE_USER array', () => {
    GAME_ONLINE_USERS_MOCK.push(gamePlayerMock);

    removePlayerFromConectedUsersById('12345', GAME_ONLINE_USERS_MOCK);
    expect(GAME_ONLINE_USERS_MOCK).toHaveLength(3);
    expect(GAME_ONLINE_USERS_MOCK[0]).not.toEqual(gamePlayerMock);
    expect(GAME_ONLINE_USERS_MOCK[1]).not.toEqual(gamePlayerMock);
    expect(GAME_ONLINE_USERS_MOCK[2]).not.toEqual(gamePlayerMock);
  });
});