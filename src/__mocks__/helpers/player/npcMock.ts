import { PlayerPopulated } from '../../../interfaces/PlayerPopulated.ts';

export const NPCS_MOCK: PlayerPopulated[] = [
  {
    attributes: {
      intelligence: 163,
      dexterity: 110,
      charisma: 252,
      constitution: 105,
      strength: 150,
      insanity: 70,
      hit_points: 0,
      attack: 0,
      defense: 0,
      magic_resistance: 0,
      CFP: 0,
      BCFA: 0,
      resistance: 0
    },
    'equipment': {
      'weapon': {
        'modifiers': {
          'intelligence': 0,
          'dexterity': 11,
          'constitution': 15,
          'insanity': 0,
          'charisma': 8,
          'strength': 0
        },
        '_id': '66fa657385f0d4f8e349db0b',
        'name': 'Hammer of the Eternal Eclipse',
        'description': 'A hammer that balances light and darkness.',
        'type': 'weapon',
        'image': '/images/equipment/weapons/hammer_16.png',
        'value': 20000,
        'base_percentage': 18,
        'min_lvl': 24,
        'die_faces': 20,
        'die_modifier': 4,
        'die_num': 10,
        'isUnique': true,
        'isActive': true
      },
      'armor': {
        'modifiers': {
          'strength': 0,
          'constitution': 10,
          'dexterity': 10,
          'intelligence': 45,
          'insanity': 0,
          'charisma': 0
        },
        '_id': '66f3ea2eb32d7add9a0876ba',
        'name': 'Eternal Night Leather Armor',
        'description': 'This armor seems to absorb the very light around it.',
        'type': 'armor',
        'image': '/images/equipment/armors/leather_armor_17.png',
        'value': 5000,
        'defense': 170,
        'isUnique': true,
        'isActive': true,
        'min_lvl': 20
      },
      'helmet': {
        'modifiers': {
          'intelligence': 14,
          'dexterity': 12,
          'constitution': 15,
          'insanity': 8,
          'charisma': 13,
          'strength': 18
        },
        '_id': '66fa4bea85f0d4f8e349da9f',
        'name': 'Crown of the Unseen Emperors',
        'description': 'Bestowed upon eternal rulers.',
        'type': 'helmet',
        'image': '/images/equipment/helmets/full_helmet_2.png',
        'value': 2100,
        'defense': 42,
        'min_lvl': 20,
        'isUnique': true,
        'isActive': true
      },
      'shield': {
        'modifiers': {
          'intelligence': 10,
          'dexterity': 12,
          'constitution': 15,
          'insanity': 0,
          'charisma': 8,
          'strength': 5
        },
        '_id': '66f27ec7c114335cadf45dae',
        'name': 'Shield of the Stormcaller',
        'description': 'A shield that summons storms to protect its bearer.',
        'type': 'shield',
        'image': '/images/equipment/shields/shield_62.png',
        'value': 300,
        'defense': 50,
        'min_lvl': 18,
        'isUnique': true,
        'isActive': false
      },
      'boot': {
        'modifiers': {
          'intelligence': 9,
          'dexterity': 15,
          'constitution': 8,
          'insanity': 7,
          'charisma': 6,
          'strength': 5
        },
        '_id': '66f695614a8f1157dab87be3',
        'name': 'Shadowstep Boots',
        'description': 'Allows silent movement through shadows.',
        'type': 'boot',
        'image': '/images/equipment/boots/full_boot_7.png',
        'value': 1800,
        'defense': 44,
        'min_lvl': 21,
        'isActive': true,
        'isUnique': true
      },
      ring: {
        modifiers: {
          intelligence: 25,
          dexterity: 25,
          constitution: 35,
          insanity: 15,
          charisma: 20,
          strength: 0,
          hit_points: 0,
          attack: 0,
          defense: 0,
          magic_resistance: 0,
          CFP: 0,
          BCFA: 0,
          resistance: 0
        },
        _id: '66fa7a0585f0d4f8e349db1c',
        name: 'Ring of the Shadow Whisperer',
        description: 'A ring that grants secrets whispered by the shadows.',
        type: 'ring',
        image: '/images/equipment/rings/ring_42.png',
        value: 3000,
        min_lvl: 22,
      },
      'artifact': {
        'modifiers': {
          'intelligence': 0,
          'dexterity': 0,
          'constitution': 5,
          'insanity': 5,
          'charisma': 10,
          'strength': 0
        },
        '_id': '676161cc317c38e05431c546',
        'name': 'Artifact of the Withered Pact',
        'description': 'A corrupted relic that devours the will of those who dare to trust.',
        'type': 'artifact',
        'image': '/images/betrayar/artifact.png',
        'value': 10,
        'min_lvl': 1,
        'isActive': false,
        'isUnique': true
      },
      'antidote_potion': {
        '_id': '668bca125319ea9afdff0764',
        'name': 'Antidote of Wailing Plague',
        'description': 'A cooling elixir brewed from the leaves of the Frostmind plant, alleviating migraines and clearing hallucinations.',
        'type': 'antidote',
        'image': '/images/equipment/potions/antidote/antidote_3.png',
        'value': 10,
        'recovery_effect': {
          'modifiers': {
            'hit_points': 0,
            'intelligence': 0,
            'dexterity': 0,
            'insanity': 7,
            'charisma': -9,
            'constitution': 0,
            'strength': 0
          },
          '_id': '6693fd5846527d0df5f0efe9',
          'name': 'Wailing Plague',
          'description': 'An infectious disease that causes the afflicted to uncontrollably wail in pain, spreading misery and despair.',
          'type': 'illness',
          'antidote_effects': [
            'lesser_restore_insanity',
            'lesser_restore_charisma'
          ],
          'poison_effects': [
            'lesser_damage_insanity',
            'lesser_damage_charisma'
          ]
        },
        'min_lvl': 1
      },
      'enhancer_potion': {
        'modifiers': {
          'intelligence': 0,
          'dexterity': 0,
          'constitution': 20,
          'insanity': 0,
          'charisma': 0,
          'strength': 0
        },
        '_id': '668bca135319ea9afdff076f',
        'name': 'Elixir of Increase Constitution',
        'description': 'This hearty elixir enhances the drinker\'s physical resilience and endurance.',
        'type': 'elixir',
        'image': '/images/equipment/potions/enhancer/enhancer_3.png',
        'value': 10,
        'duration': 2,
        'min_lvl': 1
      },
      'healing_potion': {
        'modifiers': {
          'hit_points': 20,
          'intelligence': 0,
          'dexterity': 0,
          'constitution': 0,
          'insanity': 0,
          'charisma': 0,
          'strength': 0
        },
        '_id': '668bca125319ea9afdff0750',
        'name': 'Essence of Vitality',
        'description': 'A rejuvenating potion that restores vigor and vitality to the drinker.',
        'type': 'essence',
        'image': '/images/equipment/potions/healing/healing_1.png',
        'value': 10,
        'min_lvl': 1
      }
    },
    'inventory': {
      'ingredients': [],
      'helmets': [],
      'weapons': [],
      'armors': [],
      'shields': [],
      'artifacts': [],
      'boots': [],
      'rings': [],
      'antidote_potions': [],
      'healing_potions': [],
      'enhancer_potions': []
    },
    _id: '',
    name: '',
    nickname: '',
    avatar: '',
    email: '',
    experience: 0,
    level: 0,
    gold: 0,
    is_active: false,
    created_date: '',
    profile: null,
    classroom_id: null,
    isBetrayer: false,
    tasks: []
  }
];
