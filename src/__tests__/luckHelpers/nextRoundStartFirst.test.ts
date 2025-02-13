import { nextRoundStartFirstMockPlayers, nextRoundStartFirstPlayer } from '../../__mocks__/luck/nextRoundStartFirstMock.ts';
import { nextRoundStartFirst } from '../../helpers/game.ts';

describe('test nextRoundStartFirst function', () => {
  it('should change the turns array correctly', () => {

    nextRoundStartFirst(nextRoundStartFirstPlayer._id, nextRoundStartFirstMockPlayers);

    expect(nextRoundStartFirstMockPlayers[0]).toEqual(nextRoundStartFirstPlayer);
    expect(nextRoundStartFirstMockPlayers).toHaveLength(nextRoundStartFirstMockPlayers.length);
  });
});