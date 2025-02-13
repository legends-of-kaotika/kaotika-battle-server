import { GAME_ONLINE_USERS_MOCK } from '../../__mocks__/game/gamePlayerMock.ts';
import { handlePlayerDeath } from '../../helpers/player.ts';
import { sendKilledPlayer } from '../../sockets/emits/user.ts';

jest.mock('../../sockets/emits/user', () => ({
  sendKilledPlayer: jest.fn()
}));


describe('test handlePlayerDeath function', () => {


  it('should remove correctly the player from the array if the id exist', () => {
    const mockPlayers = [...GAME_ONLINE_USERS_MOCK];

    handlePlayerDeath('66decc4ff42d4a193db77e11', mockPlayers);
    expect(mockPlayers[0]._id).not.toEqual('66decc4ff42d4a193db77e11');
    expect(mockPlayers[1]._id).not.toEqual('66decc4ff42d4a193db77e11');
    
    expect(sendKilledPlayer).toHaveBeenCalled();
  });

  it('should not remove any player if the id dont exist', () => {
    handlePlayerDeath('', GAME_ONLINE_USERS_MOCK);
    expect(GAME_ONLINE_USERS_MOCK).toHaveLength(3);
  });
});