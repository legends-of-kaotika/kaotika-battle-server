import { Player } from '../db/models/index.ts';
import { updateAttributesForProfileName } from './AttributeCalculator.ts';
import { updateGoldInLevel } from './GoldCalculator.ts';
import { addPieceToInventory } from './InventoryUtils.ts';
import { calculateLevelUp } from './LevelUpCalculator.ts';
import { sendLevelUpEmail } from './LevelUpMailer.ts';
import { getAllEquipment, getRandomEquipment } from './EquipmentRepository.ts';
import type { LevelUpAttributes, RewardInventory, RewardPlayer } from './types.ts';

interface LevelUpRewards {
  gold: number;
  attributes: LevelUpAttributes;
  inventory: RewardInventory;
}

const applyLevelUpRewards = async (player: RewardPlayer,
  numOfLevelsToAdd: number,): Promise<LevelUpRewards> => {
  const playerWithProfile = await Player.findById(player._id).populate('profile').exec();
  if (!playerWithProfile) throw new Error('Player not found');
  const profileDoc = playerWithProfile.profile as { name?: string } | null;
  const profileName = profileDoc?.name ?? '';
  const allEquipment = await getAllEquipment();

  let newGold = player.gold;
  let attributes = { ...player.attributes };
  let inventory = player.inventory;

  for (let i = 0; i < numOfLevelsToAdd; i++) {
    const levelToUpdate = player.level + i + 1;
    const randomPiece = getRandomEquipment(levelToUpdate, allEquipment);
    attributes = updateAttributesForProfileName(profileName, attributes);
    newGold += updateGoldInLevel(player, levelToUpdate);
    if (!player.isBetrayer && randomPiece) {
      inventory = addPieceToInventory(inventory, randomPiece);
    } else if (player.isBetrayer) {
      newGold = player.gold;
    }
  }

  return { gold: newGold, attributes, inventory };
};

export const checkIfLevelUpAndUpdatePlayer = async (player: RewardPlayer,
  absoluteXP: number,): Promise<number> => {
  const { newXP, newLevel, numOfLevelsToAdd, isLevelUp } = calculateLevelUp(player, absoluteXP);

  let inventory = player.inventory;
  let newGold = player.gold;

  if (isLevelUp) {
    const rewards = await applyLevelUpRewards(player, numOfLevelsToAdd);
    newGold = rewards.gold;
    inventory = rewards.inventory;

    await Player.updateOne({ _id: player._id },
      { $set: { attributes: rewards.attributes, inventory, gold: newGold, level: newLevel } },);

    try {
      await sendLevelUpEmail(player.email, newLevel);
    } catch (error) {
      console.error('Error sending level up email:', error instanceof Error ? error.message : error);
    }
  }

  await Player.updateOne({ _id: player._id }, { experience: newXP });
  return newGold;
};
