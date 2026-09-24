import { Mission, Npc } from '../db/models/index.ts';
import type { Battle } from '../interfaces/Battles.ts';
import type { PlayerPopulated } from '../interfaces/PlayerPopulated.ts';

const NPC_EQUIPMENT_PATHS = ['armor', 'weapon', 'artifact', 'ring', 'helmet', 'shield', 'boot'] as const;

/* eslint-disable @typescript-eslint/no-explicit-any */
const populateNpc = async (npcId: unknown): Promise<any | null> => {
  const npc: any = await Npc.findById(npcId).populate('profile').exec();
  if (!npc) return null;
  await Promise.all(NPC_EQUIPMENT_PATHS.map((path) => npc.populate(path, { profiles: 0 })));
  return npc;
};

export const getMissions = async (): Promise<Battle[]> => {
  const npcs = await Npc.find().exec();
  const npcsPopulated = await Promise.all(npcs.map((npc) => populateNpc(npc._id)));

  const missions = await Mission.find().exec();
  return missions.map((mission) => {
    const plain = mission.toObject() as unknown as Battle & { enemies: unknown[] };
    plain.enemies = plain.enemies.map((enemyId) => npcsPopulated.find((npc) => npc && String(npc._id) === String(enemyId)) as PlayerPopulated,);
    return plain;
  });
};
