import { ONLINE_USERS_MOCK } from '../../__mocks__/players.ts';
import * as playerHelpers from '../../helpers/player.ts';
import { Player } from '../../interfaces/Player.ts';

const mockPlayer = {...ONLINE_USERS_MOCK[0]};

const id = '66decc4ff42d4a193db77e71';
const damage = 10;

describe('applyDamage method', () => {
  let playerCopy: Player;
  let findPlayerByIdSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create a fresh copy with the complete Player type
    playerCopy = JSON.parse(JSON.stringify(mockPlayer));

    // Update spy with correct type annotation
    findPlayerByIdSpy = jest.spyOn(playerHelpers, 'findPlayerById')
      .mockImplementation((playerId: string): Player | undefined => {
        console.log('findPlayerById called with:', playerId);
        return playerId === id ? playerCopy : undefined;
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should apply correct damage to the targetPlayer', async () => {
    console.log('Before damage - hit points:', playerCopy.attributes.hit_points);
    
    playerHelpers.applyDamage(id, damage);
    
    console.log('After damage - hit points:', playerCopy.attributes.hit_points);
    
    expect(findPlayerByIdSpy).toHaveBeenCalledWith(id);
    expect(playerCopy.attributes.hit_points).toBe(25);
  });
});