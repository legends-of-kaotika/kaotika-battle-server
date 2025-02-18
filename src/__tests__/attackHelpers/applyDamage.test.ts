import { ONLINE_USERS_MOCK } from '../../__mocks__/players.ts';
import * as playerHelpers from '../../helpers/player.ts';

const mockPlayer = {...ONLINE_USERS_MOCK[0]};

const id = '66decc4ff42d4a193db77e71';
const damage = {hit_points: 10};

describe('applyDamage method', () => {

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(playerHelpers, 'findPlayerById').mockReturnValue(mockPlayer);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should apply correct damage to the targetPlayer', async () => {
    playerHelpers.applyDamage(id, damage);
    expect(mockPlayer.attributes.hit_points).toBe(25);
  });
});