import { PlayerPopulated } from '../../../interfaces/PlayerPopulated.ts';

export const NPCS_MOCK: PlayerPopulated[] = [
  {
    '_id': '67ac72f9c71f4c928d3bbe66',
    'name': 'Dicerius',
    'nickname': 'Dicerius',
    'email': 'trym6@gmail.com',
    'avatar': '/images/Dicerius.webp',
    'classroom_Id': '11677732607425227312',
    'level': 120,
    'experience': 209000,
    'is_active': false,
    'profile': {
      '_id': '6687c31b7a5ce485a0eed47d',
      'name': 'Poet',
      'description': 'In the grand halls of kings and the humble abodes of commoners, the Poet weaves his magic with words. His voice is a symphony, each phrase a note that resonates with the soul. Dressed in garments that flutter like pages of an ancient manuscript, the Poet is a wanderer and a sage, chronicling the stories of the world with a quill dipped in the ink of imagination. His verses can inspire armies, melt hearts, and stir revolutions. He sees the beauty in the mundane and the tragedy in the magnificent, capturing the essence of human experience in his lyrical tapestry. The Poet is a dreamer, a visionary, a timeless messenger of the human spirit.',
      'image': '/images/profiles/poet.jpg',
      'attributes': [
        {
          '_id': '67bedc8fd9bdf9392412cd51',
          'name': 'Intelligence',
          'description': 'The intelligence controls the chance of success when using a potion',
          'value': 20
        },
        {
          '_id': '67bedc8fd9bdf9392412cd52',
          'name': 'Dexterity',
          'description': 'Manages the chance of success when using a melee weapon and the damage a missile weapon does',
          'value': 10
        },
        {
          '_id': '67bedc8fd9bdf9392412cd53',
          'name': 'Insanity',
          'description': 'Indicates the state of mental health of an adventurer. If the insanity is high, there will be more chance to make a fumble of a critical hit, and the resulting damage will be more critical. If the insanity is low, there will be less chance to make a fumble or a critical hit, and the resulting damage will be less critical',
          'value': 20
        },
        {
          '_id': '67bedc8fd9bdf9392412cd54',
          'name': 'Charisma',
          'description': 'Indicates the chance to attack first in the next round',
          'value': 30
        },
        {
          '_id': '67bedc8fd9bdf9392412cd55',
          'name': 'Constitution',
          'description': 'Indicates the number of Hit Points an adventurer starts with',
          'value': 5
        },
        {
          '_id': '67bedc8fd9bdf9392412cd56',
          'name': 'Strength',
          'description': 'Manages the chance of success when using a melee weapon, and the damage a melee weapon does',
          'value': 5
        }
      ]
    },
    'gold': 2000,
    'tasks': [],
    'created_date': '2024-09-22T19:23:02.754Z',
    'isBetrayer': true
  },
  {
    'attributes': {
      'intelligence': 163,
      'dexterity': 110,
      'charisma': 252,
      'constitution': 105,
      'strength': 150,
      'insanity': 70
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
      'ring': {
        'modifiers': {
          'intelligence': 25,
          'dexterity': 25,
          'constitution': 35,
          'insanity': 15,
          'charisma': 20,
          'strength': 0
        },
        '_id': '66fa7a0585f0d4f8e349db1c',
        'name': 'Ring of the Shadow Whisperer',
        'description': 'A ring that grants secrets whispered by the shadows.',
        'type': 'ring',
        'image': '/images/equipment/rings/ring_42.png',
        'value': 3000,
        'min_lvl': 22,
        'isUnique': true,
        'isActive': true
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
  },

];
