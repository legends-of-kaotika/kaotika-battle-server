import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  attributes: {
    intelligence: { type: 'Number' },
    dexterity: { type: 'Number' },
    insanity: { type: 'Number' },
    charisma: { type: 'Number' },
    constitution: { type: 'Number' },
    strength: { type: 'Number' },
    hit_points: { type: 'Number' },
    attack: { type: 'Number' },
    defense: { type: 'Number' },
    magic_resistance: { type: 'Number' },
    CFP: { type: 'Number' },
    BCFA: { type: 'Number' },
    resistance: { type: 'Number' },
  },
  base_attributes: {
    intelligence: { type: 'Number' },
    dexterity: { type: 'Number' },
    insanity: { type: 'Number' },
    charisma: { type: 'Number' },
    constitution: { type: 'Number' },
    strength: { type: 'Number' },
    hit_points: { type: 'Number' },
    attack: { type: 'Number' },
    defense: { type: 'Number' },
    magic_resistance: { type: 'Number' },
    CFP: { type: 'Number' },
    BCFA: { type: 'Number' },
    resistance: { type: 'Number' },
  },
  equipment: {
    antidote_potion: {},
    healing_potion: {},
    enhancer_potion: {},
    weapon: {
      die_faces: { type: 'Number' },
      die_num: { type: 'Number' },
      die_modifier: { type: 'Number' },
      base_percentage: { type: 'Number' },
    }
  },
  inventory: {
    antidote_potions: [],
    healing_potions: [],
    enhancer_potions: [],
  },
  status: {
    ethaziumCurse: { type: 'Boolean', default: false },
    common_diseases: [],
    tired: { type: 'Boolean', default: false },
  },
  name: { type: 'String' },
  nickname: { type: 'String' },
  email: { type: 'String' },
  avatar: { type: 'String' },
  isBetrayer: { type: 'Boolean' },
  level: { type: 'Number' },
  profile: {
    name: { type: 'String' },
  },
  role: { type: 'String' },
  resistance: { type: 'Number', default: 100 }
});

export const PlayerModel = mongoose.model('Player', playerSchema);