import { parsePlayerData } from '../../../helpers/player.ts';
import { NPCS_MOCK } from '../../../__mocks__/helpers/player/npcMock.ts';
import { PlayerPopulated } from '../../../interfaces/PlayerPopulated.ts';

describe('parsePlayerData', () => {
  it('assigns a default weapon when the player has none equipped', () => {
    const fullNpc = JSON.parse(JSON.stringify(NPCS_MOCK[0])) as PlayerPopulated;
    fullNpc.equipment.weapon = null;

    const player = parsePlayerData(fullNpc);

    expect(player.equipment.weapon).toBeDefined();
    expect(player.equipment.weapon.die_num).toBe(1);
    expect(player.equipment.weapon.base_percentage).toBe(50);
  });

  it('normalizes MongoDB ObjectIds for socket authorization', () => {
    const fullNpc = JSON.parse(JSON.stringify(NPCS_MOCK[0])) as PlayerPopulated;
    fullNpc._id = { toString: () => 'mongo-player-id' } as unknown as string;

    expect(parsePlayerData(fullNpc)._id).toBe('mongo-player-id');
  });
});
