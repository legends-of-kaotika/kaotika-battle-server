import { Schema } from 'mongoose';

export const modifierSchema = new Schema({
  intelligence: Number,
  dexterity: Number,
  constitution: Number,
  insanity: Number,
  charisma: Number,
  strength: Number,
},
{ _id: false },);

export const attributesSchema = new Schema({
  intelligence: { type: Number, default: 0 },
  dexterity: { type: Number, default: 0 },
  insanity: { type: Number, default: 0 },
  charisma: { type: Number, default: 0 },
  constitution: { type: Number, default: 0 },
  strength: { type: Number, default: 0 },
},
{ _id: false },);

export const equipmentCommonFields = {
  name: String,
  description: String,
  type: String,
  image: String,
  value: Number,
  isUnique: Boolean,
  isActive: Boolean,
  modifiers: modifierSchema,
  min_lvl: Number,
  profiles: [{ type: Schema.Types.ObjectId, ref: 'Profile', index: true }],
};
