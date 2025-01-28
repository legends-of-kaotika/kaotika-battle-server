const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    attributes: {
      intelligence: { type: 'Number' },
      dexterity: { type: 'Number' },
      insanity: { type: 'Number' },
      charisma: { type: 'Number' },
      constitution: { type: 'Number' },
      strength: { type: 'Number' }
    },
    equipment: {
      helmet: {},
      weapon: {},
      armor: {},
      shield: {},
      artifact: {},
      boot: {},
      ring: {},
      antidote_potion: {},
      healing_potion: {},
      enhancer_potion: {}
    },
    inventory: {
      antidote_potions: [],
      healing_potions: [],
      enhancer_potions: [],
    },
    status:{
        ethaziumCurse: { type: 'Boolean', default: false },
        common_diseases:[],
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

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;