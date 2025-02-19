import { ONLISE_USERS_MOCK_PLAYER } from '../../../__mocks__/helpers/player/__playerMock__.ts';
import { findPlayerDeadId } from '../../../helpers/player.ts';

jest.mock('../../../game', () => {
  return { ONLINE_USERS: ONLISE_USERS_MOCK_PLAYER};
});

describe('test findPlayerDead function', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return the id of the player who is dead', () => {
    ONLISE_USERS_MOCK_PLAYER[0].attributes.hit_points = 0;

    const playerDeadId = findPlayerDeadId();

    expect(playerDeadId).toBe(ONLISE_USERS_MOCK_PLAYER[0]._id);
  });

  it('should return null if the playes isnt dead', () => {
    ONLISE_USERS_MOCK_PLAYER[0].attributes.hit_points = 1;

    const playerDeadId = findPlayerDeadId();

    expect(playerDeadId).toBe(null);
  });
});