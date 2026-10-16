import { Armor, Artifact, Boot, Helmet, Mission, Player, Ring, Shield, Weapon } from '../db/models/index.ts';
import { checkIfLevelUpAndUpdatePlayer } from '../levelup/CheckLevelUp.ts';
import { deactivateEquipment, getAllEquipment, getRandomEquipment } from '../levelup/EquipmentRepository.ts';
import { pickRandom, selectAvailableEquipment } from '../levelup/EquipmentSelection.ts';
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

    const update: Record<string, unknown> = { $inc: { gold: earnedGold } };
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
    const available: { slot: string; itemId: unknown }[] = [];
    for (const slot of INVENTORY_SLOTS) {
      const slotItems = (player.inventory as Record<string, unknown[] | undefined>)[slot] ?? [];
      for (const itemId of slotItems) {
        available.push({ slot, itemId });
      }
    }

    const update: Record<string, unknown> = { $inc: { gold: -goldLost } };
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

// ---------------------------------------------------------------------------
// Free-for-All rewards
// ---------------------------------------------------------------------------

export const FFA_WINNER_GOLD = 10000;
export const FFA_WINNER_EXP = 1750;

export interface FfaWinnerReward {
  playerId: string;
  playerName: string;
  playerAvatar: string;
  gold: number;
  experience: number;
  item?: ItemData;
  stolenItems: ItemData[];
}

export interface FfaLoserResult {
  playerId: string;
  playerName: string;
  playerAvatar: string;
  lostItem?: ItemData;
}

export interface FfaOutcome {
  winner: FfaWinnerReward;
  losers: FfaLoserResult[];
}

/**
 * Picks a unique equipment piece for `level` (+2 levels) and deactivates it
 * so it can never be assigned to another player again.
 */
const rollFfaDrop = async (level: number): Promise<DropPiece | undefined> => {
  const allEquipment = await getAllEquipment();
  const targetLevel = level + 2;
  const nonUnique = allEquipment.filter((item) => item.isUnique === false || item.isUnique === undefined);
  const available = selectAvailableEquipment(nonUnique, targetLevel, false);
  const picked = pickRandom(available);
  if (!picked) return undefined;
  // Unique drop: deactivate so it cannot be assigned again
  await deactivateEquipment(picked);
  return picked as DropPiece;
};

/**
 * Picks one random item from the loser's inventory (by slot), removes it
 * and returns its data. Returns undefined when the inventory is empty.
 */
const stealOneItemFromLoser = async (email: string,): Promise<{ stolen: ItemData; slot: string; itemId: string } | undefined> => {
  const player = await Player.findOne({ email }).exec();
  if (!player) return undefined;
  const inventory = (player.inventory ?? {}) as Record<string, unknown[] | undefined>;

  const INVENTORY_SLOTS = ['helmets', 'weapons', 'armors', 'shields', 'artifacts', 'boots', 'rings'] as const;
  const candidates: { slot: string; itemId: string }[] = [];
  for (const slot of INVENTORY_SLOTS) {
    for (const itemId of inventory[slot] ?? []) {
      candidates.push({ slot, itemId: String(itemId) });
    }
  }
  if (candidates.length === 0) return undefined;

  const picked = candidates[Math.floor(Math.random() * candidates.length)];

  // Remove from loser
  await Player.updateOne({ _id: player._id }, { $pull: { [`inventory.${picked.slot}`]: picked.itemId } });

  // Fetch item data for display
  const itemData = await fetchItemData(picked.itemId, picked.slot);
  return { stolen: itemData, slot: picked.slot, itemId: picked.itemId };
};

/** Resolves an item id + inventory slot to an ItemData for the UI. */
const fetchItemData = async (itemId: string, slot: string): Promise<ItemData> => {
  const modelBySlot: Record<string, typeof Weapon> = {
    helmets: Helmet, weapons: Weapon, armors: Armor,
    shields: Shield, artifacts: Artifact, boots: Boot, rings: Ring,
  };
  const Model = modelBySlot[slot];
  if (Model) {
    const doc = await Model.findById(itemId).exec();
    if (doc) {
      return {
        _id: itemId,
        name: (doc as unknown as Record<string, unknown>).name as string ?? '',
        description: (doc as unknown as Record<string, unknown>).description as string | undefined,
        image: (doc as unknown as Record<string, unknown>).image as string | undefined,
        type: (doc as unknown as Record<string, unknown>).type as string ?? slot.slice(0, -1),
        value: (doc as unknown as Record<string, unknown>).value as number | undefined,
        modifiers: (doc as unknown as Record<string, unknown>).modifiers as Record<string, number> | undefined,
        min_lvl: (doc as unknown as Record<string, unknown>).min_lvl as number | undefined,
        isUnique: (doc as unknown as Record<string, unknown>).isUnique as boolean | undefined,
        isActive: (doc as unknown as Record<string, unknown>).isActive as boolean | undefined,
      };
    }
  }
  return { _id: itemId, name: 'Unknown item', type: slot.slice(0, -1) };
};

/**
 * Applies Free-for-All rewards:
 *  - Winner: +10000 gold, +1750 exp, unique drop at (level + 2) deactivated after grant.
 *  - Each loser loses 1 random inventory item; the winner receives them (scavenger).
 */
export const applyFfaRewards = async (battleID: string,
  winner: BattlePlayerInput,
  losers: BattlePlayerInput[],): Promise<FfaOutcome> => {
  const winnerDoc = await Player.findOne({ email: winner.email }).exec();
  if (!winnerDoc) throw new Error(`Winner not found for email: ${winner.email}`);

  // 1. Winner gold + exp + level-up check
  const rewardPlayer = toRewardPlayer(winnerDoc);
  await checkIfLevelUpAndUpdatePlayer(rewardPlayer, winnerDoc.experience + FFA_WINNER_EXP);
  await Player.updateOne({ _id: winnerDoc._id }, { $inc: { gold: FFA_WINNER_GOLD } });

  // 2. Unique drop at winner level + 2, then deactivated
  const drop = await rollFfaDrop(winnerDoc.level);
  const dropItem = drop ? toItemData(drop) : undefined;
  if (drop) {
    await Player.updateOne({ _id: winnerDoc._id }, { $addToSet: { [`inventory.${drop.type}s`]: drop._id } });
  }

  // 3. Steal one item from each loser → give to winner
  const stolenItems: ItemData[] = [];
  const losersResult: FfaLoserResult[] = [];
  for (const loser of losers) {
    if (loser.email === winner.email) continue;
    const stolen = await stealOneItemFromLoser(loser.email);
    const loserDoc = await Player.findOne({ email: loser.email }).exec();
    const loserName = loserDoc ? (loserDoc.name || loserDoc.nickname || '') : loser.email;
    const loserAvatar = loserDoc ? (loserDoc.avatar || '') : '';
    if (stolen) {
      // Add stolen item to winner inventory
      await Player.updateOne({ _id: winnerDoc._id },
        { $addToSet: { [`inventory.${stolen.slot}`]: stolen.itemId } },);
      stolenItems.push(stolen.stolen);
      losersResult.push({
        playerId: String(loserDoc?._id ?? loser.email),
        playerName: loserName,
        playerAvatar: loserAvatar,
        lostItem: stolen.stolen,
      });
    } else {
      losersResult.push({
        playerId: String(loserDoc?._id ?? loser.email),
        playerName: loserName,
        playerAvatar: loserAvatar,
      });
    }
  }

  return {
    winner: {
      playerId: String(winnerDoc._id),
      playerName: winnerDoc.name || winnerDoc.nickname || '',
      playerAvatar: winnerDoc.avatar || '',
      gold: FFA_WINNER_GOLD,
      experience: FFA_WINNER_EXP,
      item: dropItem,
      stolenItems,
    },
    losers: losersResult,
  };
};
