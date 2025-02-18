import { ONLINE_USERS_MOCK } from '../../../__mocks__/players.ts';
import * as fumbleHelpers from '../../../helpers/fumble.ts';

const mockPlayer = {...ONLINE_USERS_MOCK[0]};

describe('applyFumble method', () => {

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(fumbleHelpers, 'applySlashDamage').mockReturnValue({hit_points: 10});
    jest.spyOn(fumbleHelpers, 'applyFairytaleDamage').mockReturnValue({eruditoGlasses: true});
    jest.spyOn(fumbleHelpers, 'applyHackDamage').mockReturnValue({dexterity: 20});

    jest.spyOn(fumbleHelpers, 'getCalculationFumbleDamage').mockReturnValue(20);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return correct slash fumble object', async () => {
    const fumbleResult = fumbleHelpers.applyFumble('slash', mockPlayer.attributes, 20, 40);
    expect(fumbleResult).toEqual({percentile: 40, message: 'Is self-injured slightly', type: 'slash', damage: {hit_points: 10}});
  });
  it('should return correct hack fumble object', async () => {
    const fumbleResult = fumbleHelpers.applyFumble('hack', mockPlayer.attributes, 20, 40);
    expect(fumbleResult).toEqual({percentile: 40, message: 'Self leg broken', type: 'hack', damage: {dexterity: 20}});
  });
  it('should return correct smash fumble object', async () => {
    const fumbleResult = fumbleHelpers.applyFumble('smash', mockPlayer.attributes, 20, 40);
    expect(fumbleResult).toEqual({percentile: 40, message: 'Is self-injured heavily', type: 'smash', damage: {hit_points: 20}});
  });
});