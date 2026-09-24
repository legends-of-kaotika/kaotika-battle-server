export interface LevelUpAttributes {
  intelligence: number;
  dexterity: number;
  insanity: number;
  charisma: number;
  constitution: number;
  strength: number;
}

export type InventoryItemRef = string | { toString(): string };

export type RewardInventory = Record<string, InventoryItemRef[]>;

export interface EquipmentPiece {
  _id: InventoryItemRef;
  type: string;
  min_lvl?: number;
  isUnique?: boolean;
  isActive?: boolean;
}

export interface RewardPlayer {
  _id: InventoryItemRef;
  classroom_Id?: string | null;
  email: string;
  level: number;
  experience: number;
  gold: number;
  isBetrayer: boolean;
  attributes: LevelUpAttributes;
  inventory: RewardInventory;
  profile?: unknown;
}

export interface LevelUpCalculation {
  newXP: number;
  newLevel: number;
  numOfLevelsToAdd: number;
  isLevelUp: boolean;
}
