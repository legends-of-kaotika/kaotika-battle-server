import { Roll } from './Roll.ts';
import type { EquipmentPiece } from './types.ts';

const EQUIPMENT_PROBABILITY = { LOW_LEVEL: 20, NORMAL: 80 };

export const rollLowLevelProbability = (): boolean =>
  new Roll(100, 1, 0).execute() <= EQUIPMENT_PROBABILITY.LOW_LEVEL;

export const selectAvailableEquipment = (nonUniqueEquipment: EquipmentPiece[],
  levelToUpdate: number,
  isLowLevelRoll: boolean,): EquipmentPiece[] => {
  const minLevel = Math.max(1, levelToUpdate - 2);
  const maxLevel = levelToUpdate + 2;
  const normalRange = nonUniqueEquipment.filter((item) => (item.min_lvl ?? 0) > minLevel && (item.min_lvl ?? 0) <= maxLevel,);
  const lowRange = nonUniqueEquipment.filter((item) => (item.min_lvl ?? 0) <= minLevel);
  return isLowLevelRoll || normalRange.length === 0 ? lowRange : normalRange;
};

export const pickRandom = <T>(items: T[]): T | undefined =>
  items[Math.floor(Math.random() * items.length)];
