import { Mission, Player } from '../db/models/index.ts';
import { checkIfLevelUpAndUpdatePlayer } from '../levelup/CheckLevelUp.ts';
import { getAllEquipment, getRandomEquipment } from '../levelup/EquipmentRepository.ts';
import type { EquipmentPiece, RewardPlayer } from '../levelup/types.ts';
import type { ItemData, PlayerReward } from '../interfaces/BattleRewards.ts';

type DropPiece = EquipmentPiece & Partial<ItemData>;

const toItemData = (item: DropPiece): ItemData => ({
  _id: String(item._id),
  name: item.name ?? '',
  description: item.description,
  image: item.image,
  type: item.type,
  value: item.value,
  modifiers: item.modifiers,
  min_lvl: item.min_lvl,
  isUnique: item.isUnique,
  isActive: item.isActive,
});

const DEFAULT_ATTRIBUTES = {
  intelligence: 0,
  dexterity: 0,
  insanity: 0,
  charisma: 0,
  constitution: 0,
  strength: 0,
};

type LooseAttributes = Partial<Record<keyof typeof DEFAULT_ATTRIBUTES, number | null | undefined>> | null | undefined;

const toRewardPlayer = (player: {
  _id: unknown;
  email: string;
  level: number;
  experience: number;
  gold: number;
  isBetrayer: boolean;
  attributes?: LooseAttributes;
  inventory?: Record<string, unknown> | null;
  classroom_Id?: string | null;
}): RewardPlayer => {
  const attributes = { ...DEFAULT_ATTRIBUTES };
  if (player.attributes) {
    for (const key of Object.keys(DEFAULT_ATTRIBUTES) as (keyof typeof DEFAULT_ATTRIBUTES)[]) {
      const value = player.attributes[key];
      if (typeof value === 'number') attributes[key] = value;
    }
  }
  return {
    _id: player._id as RewardPlayer['_id'],
    email: player.email,
    level: player.level,
    experience: player.experience,
    gold: player.gold,
    isBetrayer: player.isBetrayer,
    attributes,
    inventory: (player.inventory ?? {}) as RewardPlayer['inventory'],
    classroom_Id: player.classroom_Id ?? null,
  };
};

export interface BattlePlayerInput {
  email: string;
  isAlive: boolean;
}

export const applyBattleRewards = async (battleID: string,
  players: BattlePlayerInput[],): Promise<{ gold: number; experience: number; playerRewards: PlayerReward[] }> => {
  const mission = await Mission.findById(battleID).exec();
  if (!mission) throw new Error(`Mission not found for battleID: ${battleID}`);

  const gold = mission.gold || 0;
  const experience = mission.exp || 0;
  const dropItemLevel = mission.drop_item_level || 1;
  const allEquipment = await getAllEquipment();
  const playerRewards: PlayerReward[] = [];

  for (const { email, isAlive } of players) {
    const player = await Player.findOne({ email }).exec();
    if (!player) {
      console.log(`[BattleRewards] Player not found for email: ${email}`);
      continue;
    }

    const earnedExperience = isAlive ? experience : Math.floor(experience * 0.25);
    const earnedGold = isAlive ? gold : 0;
    const rewardPlayer = toRewardPlayer(player);

    await checkIfLevelUpAndUpdatePlayer(rewardPlayer, player.experience + earnedExperience);

    const newGold = Math.max(0, player.gold + earnedGold);
    const update: Record<string, unknown> = { $set: { gold: newGold } };
    let item: DropPiece | undefined;

    if (isAlive) {
      item = getRandomEquipment(dropItemLevel, allEquipment) as DropPiece | undefined;
      if (item) {
        update.$addToSet = { [`inventory.${item.type}s`]: item._id };
      }
    }

    await Player.updateOne({ _id: player._id }, update);

    if (!isAlive) continue;

    const reward: PlayerReward = {
      playerId: String(player._id),
      playerName: player.name || player.nickname || '',
      playerAvatar: player.avatar || '',
    };
    if (item) reward.item = toItemData(item);
    playerRewards.push(reward);
  }

  return { gold, experience, playerRewards };
};

const INVENTORY_SLOTS = ['helmets', 'weapons', 'armors', 'shields', 'artifacts', 'boots', 'rings', 'ingredients'] as const;

export const applyBattlePenalties = async (players: BattlePlayerInput[],): Promise<{ playerId: string; goldLost: number; lostItem: string | null }[]> => {
  const penalties: { playerId: string; goldLost: number; lostItem: string | null }[] = [];

  for (const { email } of players) {
    const player = await Player.findOne({ email }).exec();
    if (!player) {
      console.log(`[BattlePenalties] Player not found for email: ${email}`);
      continue;
    }

    const currentGold = player.gold || 0;
    const goldLost = Math.floor(currentGold * 0.25);
    const newGold = Math.max(0, currentGold - goldLost);

    const available: { slot: string; itemId: unknown }[] = [];
    for (const slot of INVENTORY_SLOTS) {
      const slotItems = (player.inventory as Record<string, unknown[] | undefined>)[slot] ?? [];
      for (const itemId of slotItems) {
        available.push({ slot, itemId });
      }
    }

    const update: Record<string, unknown> = { $set: { gold: newGold } };
    let lostItem: unknown = null;
    if (available.length > 0) {
      const picked = available[Math.floor(Math.random() * available.length)];
      lostItem = picked.itemId;
      update.$pull = { [`inventory.${picked.slot}`]: picked.itemId };
    }

    await Player.updateOne({ _id: player._id }, update);

    penalties.push({
      playerId: String(player._id),
      goldLost,
      lostItem: lostItem ? String(lostItem) : null,
    });
  }

  return penalties;
};

export const recordBattleOutcome = async (players: BattlePlayerInput[],
  battleID: string | null,
  winner: string,): Promise<{ status: 'OK'; data: Record<string, unknown> }> => {
  if (!players) throw new Error('Missing required fields: players');
  if (winner === 'dravokar') {
    const penalties = await applyBattlePenalties(players);
    return { status: 'OK', data: { penalties } };
  }
  if (!battleID) throw new Error('Missing required field: battleID');
  const rewards = await applyBattleRewards(battleID, players);
  return { status: 'OK', data: rewards };
};
