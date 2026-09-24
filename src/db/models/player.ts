import { model, Schema } from 'mongoose';
import { attributesSchema } from './schemas.ts';

const inventorySlots = {
  helmets: [{ type: Schema.Types.ObjectId, ref: 'Helmet' }],
  weapons: [{ type: Schema.Types.ObjectId, ref: 'Weapon' }],
  armors: [{ type: Schema.Types.ObjectId, ref: 'Armor' }],
  shields: [{ type: Schema.Types.ObjectId, ref: 'Shield' }],
  artifacts: [{ type: Schema.Types.ObjectId, ref: 'Artifact' }],
  boots: [{ type: Schema.Types.ObjectId, ref: 'Boot' }],
  rings: [{ type: Schema.Types.ObjectId, ref: 'Ring' }],
  ingredients: [{ type: Schema.Types.ObjectId, ref: 'Ingredient' }],
};

const playerSchema = new Schema({
  name: String,
  nickname: String,
  email: { type: String, required: true, unique: true, index: true },
  avatar: String,
  classroom_Id: { type: String, default: null },
  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true },
  profile: { type: Schema.Types.ObjectId, ref: 'Profile' },
  isBetrayer: { type: Boolean, default: false },
  attributes: attributesSchema,
  equipment: {
    helmet: { type: Schema.Types.ObjectId, ref: 'Helmet', default: '66d99aac7518eb4990035363' },
    weapon: { type: Schema.Types.ObjectId, ref: 'Weapon' },
    armor: { type: Schema.Types.ObjectId, ref: 'Armor' },
    shield: { type: Schema.Types.ObjectId, ref: 'Shield', default: '66f27c81c114335cadf45d70' },
    artifact: { type: Schema.Types.ObjectId, ref: 'Artifact' },
    boot: { type: Schema.Types.ObjectId, ref: 'Boot', default: '66d99a807518eb499003535f' },
    ring: { type: Schema.Types.ObjectId, ref: 'Ring', default: '66a6d6c8dfbffe7e6503970f' },
  },
  inventory: inventorySlots,
  tasks: [{
    classroomId: String,
    courseWorkName: String,
    grade: Number,
    selectedAssignment: String,
    maxPoints: Number,
  }],
  skills: [{
    skill: { type: Schema.Types.ObjectId, ref: 'Skill' },
    points: { type: Number, default: 0 },
  }],
  created_date: { type: Date, default: Date.now },
  gold: { type: Number, default: 50 },
}, { versionKey: false });

export const Player = model('Player', playerSchema);
