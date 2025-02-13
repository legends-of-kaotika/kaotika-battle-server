import { ONLINE_USERS_MOCK, playerMock } from '../../__mocks__/players.ts';
import { nextRoundStartFirst } from '../../helpers/game.ts';
import { Player } from '../../interfaces/Player.ts';

jest.mock('../../game', () => ({
  ONLINE_USERS: ONLINE_USERS_MOCK,
}));

describe('test nextRoundStartFirst function', () => {
  it('should change the turns array correctly', () => {
    const newPlayer: Player = { ...playerMock, _id: '12345' };
    nextRoundStartFirst(newPlayer._id, ONLINE_USERS_MOCK);

    expect(ONLINE_USERS_MOCK[0]).toEqual(newPlayer);
    expect(ONLINE_USERS_MOCK).toHaveLength(ONLINE_USERS_MOCK.length);
  });
});