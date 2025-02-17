import { ONLINE_USERS_MOCK } from '../../../__mocks__/players.ts';
import * as fumbleHelpers from '../../../helpers/fumble.ts';

const mockPlayer = {...ONLINE_USERS_MOCK[0]};

describe('applyFumble method', () => {

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(fumbleHelpers, 'applySlashDamage').mockReturnValue({hit_points: 10});
    jest.spyOn(fumbleHelpers, 'applyFairytaleDamage').mockReturnValue({eruditoGlasses: true});
    jest.spyOn(fumbleHelpers, 'applyHackDamage').mockReturnValue({dexterity: 20});
    jest.spyOn(fumbleHelpers, 'applyScytheDamage').mockReturnValue({hit_points: 30});

    jest.spyOn(fumbleHelpers, 'getCalculationFumbleDamage').mockReturnValue(20);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return correct slash fumble object', async () => {
    const fumbleResult = fumbleHelpers.applyFumble('slash', mockPlayer.attributes, 20, 40);
    expect(fumbleResult).toEqual({percentile: 40, message: 'Is slash', type: 'slash', damage: {hit_points: 10}});
  });
  it('should return correct hack fumble object', async () => {
    const fumbleResult = fumbleHelpers.applyFumble('hack', mockPlayer.attributes, 20, 40);
    expect(fumbleResult).toEqual({percentile: 40, message: 'Is hack', type: 'hack', damage: {dexterity: 20}});
  });
  it('should return correct scythe fumble object', async () => {
    const fumbleResult = fumbleHelpers.applyFumble('scythe', mockPlayer.attributes, 20, 40);
    expect(fumbleResult).toEqual({percentile: 40, message: 'Is scythe', type: 'scythe', damage: {hit_points: 30}});
  });
});