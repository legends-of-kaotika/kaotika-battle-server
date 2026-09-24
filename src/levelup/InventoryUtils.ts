import type { EquipmentPiece, RewardInventory } from './types.ts';

export const inventoryKeyFor = (piece: EquipmentPiece): string => `${piece.type}s`;

export const addPieceToInventory = (inventory: RewardInventory,
  piece: EquipmentPiece,): RewardInventory => {
  const inventoryType = inventoryKeyFor(piece);
  return { ...inventory, [inventoryType]: [...inventory[inventoryType], piece._id] };
};
