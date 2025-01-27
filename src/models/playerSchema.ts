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
      helmets: [],
      weapons: [],
      armors: [],
      shields: [],
      artifacts: [],
      boots: [],
      rings: [],
      antidote_potions: [],
      healing_potions: [],
      enhancer_potions: [],
      ingredients: []
    },
    status:{
        ethaziumCurse: { type: 'Boolean', default: false },
        common_diseases:[],
        tired: { type: 'Boolean', default: false },
    },
    _id: { type: 'ObjectId' },
    name: { type: 'String' },
    nickname: { type: 'String' },
    email: { type: 'String' },
    avatar: { type: 'String' },
    level: { type: 'Number' },
    profile: {
      _id: { type: 'ObjectId' },
      name: { type: 'String' },
      description: { type: 'String' },
      image: { type: 'String' },
      attributes: { type: [Array] }
    },
    role: { type: 'String' },
    resistance: { type: 'Number', default: 100 }
  });

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;