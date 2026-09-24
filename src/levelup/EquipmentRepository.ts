import { Armor, Artifact, Boot, Helmet, Ring, Shield, Weapon } from '../db/models/index.ts';
import { pickRandom, rollLowLevelProbability, selectAvailableEquipment } from './EquipmentSelection.ts';
import type { EquipmentPiece } from './types.ts';

export const getAllEquipment = async (): Promise<EquipmentPiece[]> => {
  const [weapons, armors, artifacts, helmets, boots, rings, shields] = await Promise.all([
    Weapon.find().exec(),
    Armor.find().exec(),
    Artifact.find().exec(),
    Helmet.find().exec(),
    Boot.find().exec(),
    Ring.find().exec(),
    Shield.find().exec(),
  ]);

  const allEquipment = [
    ...weapons,
    ...armors,
    ...artifacts,
    ...helmets,
    ...boots,
    ...rings,
    ...shields,
  ].map((doc) => doc.toObject() as EquipmentPiece);

  if (allEquipment.length === 0) {
    throw new Error('No equipment found in the database');
  }

  return allEquipment;
};

export const getRandomEquipment = (levelToUpdate: number,
  allEquipment: EquipmentPiece[],): EquipmentPiece | undefined => {
  if (!allEquipment) throw new Error('allEquipment is required');
  const nonUnique = allEquipment.filter((item) => item.isUnique === false);
  const available = selectAvailableEquipment(nonUnique, levelToUpdate, rollLowLevelProbability());
  return pickRandom(available);
};

export const deactivateEquipment = async (piece: EquipmentPiece): Promise<void> => {
  switch (piece.type) {
  case 'armor':
    await Armor.updateOne({ _id: piece._id }, { isActive: false });
    break;
  case 'shield':
    await Shield.updateOne({ _id: piece._id }, { isActive: false });
    break;
  case 'artifact':
    await Artifact.updateOne({ _id: piece._id }, { isActive: false });
    break;
  case 'helmet':
    await Helmet.updateOne({ _id: piece._id }, { isActive: false });
    break;
  case 'boot':
    await Boot.updateOne({ _id: piece._id }, { isActive: false });
    break;
  case 'ring':
    await Ring.updateOne({ _id: piece._id }, { isActive: false });
    break;
  case 'weapon':
    await Weapon.updateOne({ _id: piece._id }, { isActive: false });
    break;
  default:
    throw new Error(`Error: Wrong equipment type: ${piece.type}`);
  }
};
