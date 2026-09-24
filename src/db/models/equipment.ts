import { model, Schema } from 'mongoose';
import { equipmentCommonFields } from './schemas.ts';

const weaponSchema = new Schema({
  ...equipmentCommonFields,
  die_faces: Number,
  die_modifier: Number,
  die_num: Number,
  base_percentage: Number,
}, { versionKey: false });

const armorSchema = new Schema({
  ...equipmentCommonFields,
  defense: Number,
});

const artifactSchema = new Schema({ ...equipmentCommonFields });
const helmetSchema = new Schema({ ...equipmentCommonFields, defense: Number });
const bootSchema = new Schema({ ...equipmentCommonFields });
const ringSchema = new Schema({ ...equipmentCommonFields });
const shieldSchema = new Schema({ ...equipmentCommonFields, defense: Number });

export const Weapon = model('Weapon', weaponSchema);
export const Armor = model('Armor', armorSchema);
export const Artifact = model('Artifact', artifactSchema);
export const Helmet = model('Helmet', helmetSchema);
export const Boot = model('Boot', bootSchema);
export const Ring = model('Ring', ringSchema);
export const Shield = model('Shield', shieldSchema);

export const equipmentModels = {
  weapon: Weapon,
  armor: Armor,
  artifact: Artifact,
  helmet: Helmet,
  boot: Boot,
  ring: Ring,
  shield: Shield,
} as const;
