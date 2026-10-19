import { Mission, Npc } from '../db/models/index.ts';
import type { Battle } from '../interfaces/Battles.ts';
import type { PlayerPopulated } from '../interfaces/PlayerPopulated.ts';

const NPC_EQUIPMENT_SLOTS = ['armor', 'weapon', 'artifact', 'ring', 'helmet', 'shield', 'boot'] as const;
const npcEquipmentPaths = NPC_EQUIPMENT_SLOTS.map((slot) => `equipment.${slot}`);

/* eslint-disable @typescript-eslint/no-explicit-any */
const populateNpc = async (npcId: unknown): Promise<any | null> => {
  const npc: any = await Npc.findById(npcId).populate('profile').populate(npcEquipmentPaths).exec();
  return npc;
};

export const getMissionTypeById = async (_id: string): Promise<'team' | 'free-for-all' | null> => {
  const mission = await Mission.findById(_id).select('mission_type').lean().exec();
  return (mission?.mission_type as 'team' | 'free-for-all' | undefined) ?? null;
};

export const getMissions = async (): Promise<Battle[]> => {
  const npcs = await Npc.find().exec();
  const npcsPopulated = await Promise.all(npcs.map((npc) => populateNpc(npc._id)));

  const missions = await Mission.find().exec();
  return missions.map((mission) => {
    const plain = mission.toObject() as unknown as Battle & { enemies: unknown[]; allied?: unknown[] };
    plain._id = String(plain._id);
    const missingNpcIds: string[] = [];
    const hydrateNpc = (npcId: unknown): PlayerPopulated => {
      const npc = npcsPopulated.find((candidate) => candidate && String(candidate._id) === String(npcId));
      if (!npc) missingNpcIds.push(String(npcId));
      if (!npc) return npc as PlayerPopulated;
      const npcData = typeof npc.toObject === 'function' ? npc.toObject() : npc;
      return { ...npcData, _id: String(npcData._id) } as PlayerPopulated;
    };
    plain.enemies = plain.enemies.map(hydrateNpc);
    plain.allied = (plain.allied ?? []).map(hydrateNpc);
    if (missingNpcIds.length > 0) {
      throw new Error(`Mission ${String(plain._id)} references missing NPCs: ${missingNpcIds.join(', ')}`);
    }
    return plain;
  });
};
