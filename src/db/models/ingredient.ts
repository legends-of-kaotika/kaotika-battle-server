import { model, Schema } from 'mongoose';

const ingredientSchema = new Schema({
  name: String,
  description: String,
  type: { type: String, default: 'ingredient' },
  value: Number,
  image: String,
  effects: [String],
  qty: Number,
  isUpgradeable: { type: Boolean, default: true },
  upgradeLevel: { type: Number, default: 0 },
  quality: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common',
  },
  category: {
    type: String,
    enum: ['herb', 'mineral', 'crystal', 'monster_part', 'fungus'],
    default: 'herb',
  },
  potency: { type: Number, default: 1 },
}, { versionKey: false });

const skillLevelSchema = new Schema({
  description: String,
  image: String,
  epicName: String,
  exp: Number,
  gold: Number,
  unique: Boolean,
  bonus: Number,
  requiredPoints: Number,
  unlockedBy: [String],
  active: { type: Boolean, default: false },
}, { _id: false, versionKey: false });

const skillSchema = new Schema({
  epicName: String,
  description: String,
  image: String,
  levels: [skillLevelSchema],
  totalPoints: Number,
}, { versionKey: false });

export const Ingredient = model('Ingredient', ingredientSchema);
export const Skill = model('Skill', skillSchema);
