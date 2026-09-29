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

export const getMissions = async (): Promise<Battle[]> => {
  const npcs = await Npc.find().exec();
  const npcsPopulated = await Promise.all(npcs.map((npc) => populateNpc(npc._id)));

  const missions = await Mission.find().exec();
  return missions.map((mission) => {
    const plain = mission.toObject() as unknown as Battle & { enemies: unknown[] };
    plain._id = String(plain._id);
    const missingNpcIds: string[] = [];
    plain.enemies = plain.enemies.map((enemyId) => {
      const npc = npcsPopulated.find((candidate) => candidate && String(candidate._id) === String(enemyId));
      if (!npc) missingNpcIds.push(String(enemyId));
      if (!npc) return npc as PlayerPopulated;
      const npcData = typeof npc.toObject === 'function' ? npc.toObject() : npc;
      return { ...npcData, _id: String(npcData._id) } as PlayerPopulated;
    });
    if (missingNpcIds.length > 0) {
      throw new Error(`Mission ${String(plain._id)} references missing NPCs: ${missingNpcIds.join(', ')}`);
    }
    return plain;
  });
};
