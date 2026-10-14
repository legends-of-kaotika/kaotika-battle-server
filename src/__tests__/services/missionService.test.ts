import { Mission, Npc } from '../../db/models/index.ts';
import { getMissions } from '../../services/missionService.ts';

jest.mock('../../db/models/index.ts', () => ({
  Mission: { find: jest.fn() },
  Npc: { find: jest.fn(), findById: jest.fn() },
}));

const objectId = (value: string) => ({ toString: () => value });

describe('missionService', () => {
  it('normalizes MongoDB mission and NPC ids', async () => {
    const npcId = objectId('npc-id');
    const missionId = objectId('mission-id');
    const populatedNpc = {
      _id: npcId,
      toObject: () => ({ _id: npcId, name: 'Enemy' }),
    };
    const npcQuery = {
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(populatedNpc),
    };

    (Npc.find as jest.Mock).mockReturnValue({ exec: jest.fn().mockResolvedValue([{ _id: npcId }]) });
    (Npc.findById as jest.Mock).mockReturnValue(npcQuery);
    (Mission.find as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue([{
        toObject: () => ({ _id: missionId, name: 'Battle', scene3d: 'dark-diorama', enemies: [npcId] }),
      }]),
    });

    const [mission] = await getMissions();

    expect(mission._id).toBe('mission-id');
    expect(mission.scene3d).toBe('dark-diorama');
    expect(mission.enemies[0]._id).toBe('npc-id');
    expect(mission.allied).toEqual([]);
  });

  it('hydrates allied npcs and defaults to empty when field is missing', async () => {
    const npcId = objectId('ally-id');
    const missionId = objectId('mission-id');
    const populatedNpc = {
      _id: npcId,
      toObject: () => ({ _id: npcId, name: 'Ally' }),
    };
    const npcQuery = {
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(populatedNpc),
    };

    (Npc.find as jest.Mock).mockReturnValue({ exec: jest.fn().mockResolvedValue([{ _id: npcId }]) });
    (Npc.findById as jest.Mock).mockReturnValue(npcQuery);
    (Mission.find as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue([
        {
          toObject: () => ({ _id: missionId, name: 'WithAlly', enemies: [], allied: [npcId] }),
        },
        {
          toObject: () => ({ _id: missionId, name: 'Legacy', enemies: [] }),
        },
      ]),
    });

    const [withAlly, legacy] = await getMissions();

    expect(withAlly.allied?.[0]._id).toBe('ally-id');
    expect(legacy.allied).toEqual([]);
  });
});
