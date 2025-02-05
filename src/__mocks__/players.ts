 

import { DividedPlayers } from '../interfaces/DividedPlayers';
import { Modifier } from '../interfaces/Modifier';
import { Player } from '../interfaces/Player';

export const ONLINE_USERS_MOCK: Player[] = 
[
  {
    _id: '66decc4ff42d4a193db77e11',
    name: 'FREDIE_MERKURY',
    nickname: 'Dr Singer',
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocIs9M5Fz0Dg1M7KgxcDGVyUSOeCIrXQmEVToR9cipfo71RLlOE=s96-c',
    email: 'fredie.mendiburu@ikasle.aeg.eus',
    level: 18,
    role: 'acolyte',
    socketId: '3o0LeOf-R28YvEMhAAAB',
    isBetrayer: true,
    profile: { name: 'Blasphemer' },
    attributes: {
      charisma: 130,
      constitution: 60,
      dexterity: 23,
      insanity: 95,
      intelligence: 29,
      strength: 18,
      resistance: 100,
      attack: -30,
      hit_points: 35,
      defense: 97,
      magic_resistance: 159,
      CFP: 95,
      BCFA: 113,
    },
    base_attributes: {
      charisma: 130,
      constitution: 60,
      dexterity: 23,
      insanity: 95,
      intelligence: 29,
      strength: 18,
      resistance: 100,
      attack: -30,
      hit_points: 35,
      defense: 97,
      magic_resistance: 159,
      CFP: 95,
      BCFA: 113,
    },
    equipment: {
      healing_potion: {
        modifiers: {
          hit_points: 40,
          intelligence: -5,
          dexterity: 0,
          constitution: 0,
          insanity: 0,
          charisma: 0,
          strength: 0,
        },
        _id: '668bca125319ea9afdff0754',
        name: 'Essence of Rejuvenation',
        description: 'This revitalizing potion restores energy and vitality to the drinker.',
        type: 'essence',
        image: '/images/equipment/potions/healing/healing_2.png',
        value: 10,
        min_lvl: 1,
      },
      antidote_potion: {
        _id: '668bca125319ea9afdff075e',
        name: 'Antidote of Frostbane Fever',
        description: 'A potent concoction brewed from the rare Lumina flowers that only bloom under the full moon...',
        type: 'antidote',
        image: '/images/equipment/potions/antidote/antidote_1.png',
        value: 10,
        recovery_effect: {
          modifiers: {
            hit_points: 0,
            intelligence: 0,
            dexterity: 0,
            insanity: 0,
            charisma: -8,
            constitution: -12,
            strength: 0,
          },
          _id: '6693fd5846527d0df5f0efe8',
          name: 'Frostbane Fever',
          description: 'A chilling illness that lowers the body temperature drastically, causing frost to form on the skin and organs to freeze.',
          type: 'illness',
          antidote_effects: ['restore_constitution', 'lesser_restore_charisma'],
          poison_effects: ['damage_constitution', 'lesser_damage_charisma'],
        },
        min_lvl: 1,
      },
      enhancer_potion: {
        modifiers: {
          intelligence: 0,
          dexterity: 0,
          constitution: 0,
          insanity: 20,
          charisma: 0,
          strength: 0,
        },
        _id: '668bca135319ea9afdff076b',
        name: 'Elixir of Madness',
        description:
          'A dangerous brew that plunges the drinker into a frenzy, this potion unleashes chaotic energy.',
        type: 'elixir',
        image: '/images/equipment/potions/enhancer/enhancer_2.png',
        value: 10,
        duration: 2,
        min_lvl: 1,
      },
      weapon: {
        modifiers: {
          intelligence: 0,
          dexterity: 0,
          constitution: 5,
          insanity: 30,
          charisma: 10,
          strength: 0,
        },
        _id: '67616050317c38e05431c530',
        name: 'Dagger of Venomous Promises',
        description: 'A poisoned blade that cuts through both flesh and trust.',
        type: 'weapon',
        image: '/images/betrayar/weapon.png',
        value: 60,
        base_percentage: 40,
        min_lvl: 2,
        die_faces: 100,
        die_modifier: 0,
        die_num: 1,
        isUnique: true,
        isActive: false,
      },
    },
    inventory: { healing_potions: [], antidote_potions: [], enhancer_potions: [] },
    status: { ethaziumCurse: false, common_diseases: [], tired: false },
  },
  {
    _id: '66decc4ff42d4a193db77e71',
    name: 'AITOR MENDIBURU BOTAS',
    nickname: 'Dr Github',
    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocIs9M5Fz0Dg1M7KgxcDGVyUSOeCIrXQmEVToR9cipfo71RLlOE=s96-c',
    email: 'aitor.mendiburu@ikasle.aeg.eus',
    level: 18,
    role: 'acolyte',
    socketId: '3o0LeOf-R28YvEMhAAAB',
    isBetrayer: true,
    profile: { name: 'Blasphemer' },
    attributes: {
      charisma: 130,
      constitution: 60,
      dexterity: 23,
      insanity: 95,
      intelligence: 29,
      strength: 18,
      resistance: 100,
      attack: -30,
      hit_points: 35,
      defense: 97,
      magic_resistance: 159,
      CFP: 95,
      BCFA: 113,
    },
    base_attributes: {
      charisma: 130,
      constitution: 60,
      dexterity: 23,
      insanity: 95,
      intelligence: 29,
      strength: 18,
      resistance: 100,
      attack: -30,
      hit_points: 35,
      defense: 97,
      magic_resistance: 159,
      CFP: 95,
      BCFA: 113,
    },
    equipment: {
      healing_potion: {
        modifiers: {
          hit_points: 40,
          intelligence: -5,
          dexterity: 0,
          constitution: 0,
          insanity: 0,
          charisma: 0,
          strength: 0,
        },
        _id: '668bca125319ea9afdff0754',
        name: 'Essence of Rejuvenation',
        description: 'This revitalizing potion restores energy and vitality to the drinker.',
        type: 'essence',
        image: '/images/equipment/potions/healing/healing_2.png',
        value: 10,
        min_lvl: 1,
      },
      antidote_potion: {
        _id: '668bca125319ea9afdff075e',
        name: 'Antidote of Frostbane Fever',
        description: 'A potent concoction brewed from the rare Lumina flowers that only bloom under the full moon...',
        type: 'antidote',
        image: '/images/equipment/potions/antidote/antidote_1.png',
        value: 10,
        recovery_effect: {
          modifiers: {
            hit_points: 0,
            intelligence: 0,
            dexterity: 0,
            insanity: 0,
            charisma: -8,
            constitution: -12,
            strength: 0,
          },
          _id: '6693fd5846527d0df5f0efe8',
          name: 'Frostbane Fever',
          description: 'A chilling illness that lowers the body temperature drastically, causing frost to form on the skin and organs to freeze.',
          type: 'illness',
          antidote_effects: ['restore_constitution', 'lesser_restore_charisma'],
          poison_effects: ['damage_constitution', 'lesser_damage_charisma'],
        },
        min_lvl: 1,
      },
      enhancer_potion: {
        modifiers: {
          intelligence: 0,
          dexterity: 0,
          constitution: 0,
          insanity: 20,
          charisma: 0,
          strength: 0,
        },
        _id: '668bca135319ea9afdff076b',
        name: 'Elixir of Madness',
        description:
          'A dangerous brew that plunges the drinker into a frenzy, this potion unleashes chaotic energy.',
        type: 'elixir',
        image: '/images/equipment/potions/enhancer/enhancer_2.png',
        value: 10,
        duration: 2,
        min_lvl: 1,
      },
      weapon: {
        modifiers: {
          intelligence: 0,
          dexterity: 0,
          constitution: 5,
          insanity: 30,
          charisma: 10,
          strength: 0,
        },
        _id: '67616050317c38e05431c530',
        name: 'Dagger of Venomous Promises',
        description: 'A poisoned blade that cuts through both flesh and trust.',
        type: 'weapon',
        image: '/images/betrayar/weapon.png',
        value: 60,
        base_percentage: 40,
        min_lvl: 2,
        die_faces: 100,
        die_modifier: 0,
        die_num: 1,
        isUnique: true,
        isActive: false,
      },
    },
    inventory: { healing_potions: [], antidote_potions: [], enhancer_potions: [] },
    status: { ethaziumCurse: false, common_diseases: [], tired: false },
  },
  {
    _id: '66dec6ab4c27dff822d80066',
    name: 'ENEKO LARREA PEREZ',
    nickname: '六四事件1989',
    avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjW79byZC_JXJCJrG0AsR_UyQdUoLxTi5YQ5W-4oD4UbHC1NI3Mo',
    email: 'eneko.larrea@ikasle.aeg.eus',
    level: 18,
    role: 'acolyte',
    socketId: 'xmfysZuwGKGtsc0IAAAD',
    isBetrayer: false,
    profile: { name: 'Gossiper' },
    attributes: {
      charisma: 99,
      constitution: 53,
      dexterity: 81,
      insanity: 34,
      intelligence: 107,
      strength: 30,
      resistance: 100,
      attack: 13,
      hit_points: 117,
      defense: 187,
      magic_resistance: 206,
      CFP: 34,
      BCFA: 64,
    },
    base_attributes: {
      charisma: 99,
      constitution: 53,
      dexterity: 81,
      insanity: 34,
      intelligence: 107,
      strength: 30,
      resistance: 100,
      attack: 13,
      hit_points: 117,
      defense: 187,
      magic_resistance: 206,
      CFP: 34,
      BCFA: 64,
    },
    equipment: {
      healing_potion: {
        modifiers: {
          hit_points: 20,
          intelligence: 0,
          dexterity: 0,
          constitution: 0,
          insanity: 0,
          charisma: 0,
          strength: 0,
        },
        _id: '668bca125319ea9afdff0750',
        name: 'Essence of Vitality',
        description: 'A rejuvenating potion that restores vigor and vitality to the drinker.',
        type: 'essence',
        image: '/images/equipment/potions/healing/healing_1.png',
        value: 10,
        min_lvl: 1,
      },
      antidote_potion: {
        _id: '668bca125319ea9afdff0764',
        name: 'Antidote of Wailing Plague',
        description:
          'A cooling elixir brewed from the leaves of the Frostmind plant, alleviating migraines and clearing hallucinations.',
        type: 'antidote',
        image: '/images/equipment/potions/antidote/antidote_3.png',
        value: 10,
        recovery_effect: {
          modifiers: {
            hit_points: 0,
            intelligence: 0,
            dexterity: 0,
            insanity: 7,
            charisma: -9,
            constitution: 0,
            strength: 0,
          },
          _id: '6693fd5846527d0df5f0efe9',
          name: 'Wailing Plague',
          description:
            'An infectious disease that causes the afflicted to uncontrollably wail in pain, spreading misery and despair.',
          type: 'illness',
          antidote_effects: ['lesser_restore_insanity', 'lesser_restore_charisma'],
          poison_effects: ['lesser_damage_insanity', 'lesser_damage_charisma'],
        },
        min_lvl: 1,
      },
      enhancer_potion: {
        modifiers: {
          intelligence: 0,
          dexterity: 0,
          constitution: 0,
          insanity: 20,
          charisma: 0,
          strength: 0,
        },
        _id: '668bca135319ea9afdff076b',
        name: 'Elixir of Madness',
        description:
          'A dangerous brew that plunges the drinker into a frenzy, this potion unleashes chaotic energy.',
        type: 'elixir',
        image: '/images/equipment/potions/enhancer/enhancer_2.png',
        value: 10,
        duration: 2,
        min_lvl: 1,
      },
      weapon: {
        modifiers: {
          intelligence: 0,
          dexterity: 0,
          constitution: 5,
          insanity: 30,
          charisma: 10,
          strength: 0,
        },
        _id: '67616050317c38e05431c530',
        name: 'Dagger of Venomous Promises',
        description: 'A poisoned blade that cuts through both flesh and trust.',
        type: 'weapon',
        image: '/images/betrayar/weapon.png',
        value: 60,
        base_percentage: 40,
        min_lvl: 2,
        die_faces: 100,
        die_modifier: 0,
        die_num: 1,
        isUnique: true,
        isActive: false,
      },
    },
    inventory: { healing_potions: [], antidote_potions: [], enhancer_potions: [] },
    status: { ethaziumCurse: false, common_diseases: [], tired: false },
  },
];

export const playerMock: Player = 
{
  _id: '66decc4ff42d4a193db77e71',
  name: 'AITOR MENDIBURU BOTAS',
  nickname: 'Dr Github',
  avatar: 'https://lh3.googleusercontent.com/a/ACg8ocIs9M5Fz0Dg1M7KgxcDGVyUSOeCIrXQmEVToR9cipfo71RLlOE=s96-c',
  email: 'aitor.mendiburu@ikasle.aeg.eus',
  level: 18,
  role: 'acolyte',
  socketId: '3o0LeOf-R28YvEMhAAAB',
  isBetrayer: true,
  profile: { name: 'Blasphemer' },
  attributes: {
    charisma: 130,
    constitution: 60,
    dexterity: 23,
    insanity: 95,
    intelligence: 29,
    strength: 18,
    resistance: 100,
    attack: -30,
    hit_points: 35,
    defense: 97,
    magic_resistance: 159,
    CFP: 95,
    BCFA: 113,
  },
  base_attributes: {
    charisma: 130,
    constitution: 60,
    dexterity: 23,
    insanity: 95,
    intelligence: 29,
    strength: 18,
    resistance: 100,
    attack: -30,
    hit_points: 35,
    defense: 97,
    magic_resistance: 159,
    CFP: 95,
    BCFA: 113,
  },
  equipment: {
    healing_potion: {
      modifiers: {
        hit_points: 40,
        intelligence: -5,
        dexterity: 0,
        constitution: 0,
        insanity: 0,
        charisma: 0,
        strength: 0,
      },
      _id: '668bca125319ea9afdff0754',
      name: 'Essence of Rejuvenation',
      description: 'This revitalizing potion restores energy and vitality to the drinker.',
      type: 'essence',
      image: '/images/equipment/potions/healing/healing_2.png',
      value: 10,
      min_lvl: 1,
    },
    antidote_potion: {
      _id: '668bca125319ea9afdff075e',
      name: 'Antidote of Frostbane Fever',
      description: 'A potent concoction brewed from the rare Lumina flowers that only bloom under the full moon...',
      type: 'antidote',
      image: '/images/equipment/potions/antidote/antidote_1.png',
      value: 10,
      recovery_effect: {
        modifiers: {
          hit_points: 0,
          intelligence: 0,
          dexterity: 0,
          insanity: 0,
          charisma: -8,
          constitution: -12,
          strength: 0,
        },
        _id: '6693fd5846527d0df5f0efe8',
        name: 'Frostbane Fever',
        description: 'A chilling illness that lowers the body temperature drastically, causing frost to form on the skin and organs to freeze.',
        type: 'illness',
        antidote_effects: ['restore_constitution', 'lesser_restore_charisma'],
        poison_effects: ['damage_constitution', 'lesser_damage_charisma'],
      },
      min_lvl: 1,
    },
    enhancer_potion: {
      modifiers: {
        intelligence: 0,
        dexterity: 0,
        constitution: 0,
        insanity: 20,
        charisma: 0,
        strength: 0,
      },
      _id: '668bca135319ea9afdff076b',
      name: 'Elixir of Madness',
      description:
        'A dangerous brew that plunges the drinker into a frenzy, this potion unleashes chaotic energy.',
      type: 'elixir',
      image: '/images/equipment/potions/enhancer/enhancer_2.png',
      value: 10,
      duration: 2,
      min_lvl: 1,
    },
    weapon: {
      modifiers: {
        intelligence: 0,
        dexterity: 0,
        constitution: 5,
        insanity: 30,
        charisma: 10,
        strength: 0,
      },
      _id: '67616050317c38e05431c530',
      name: 'Dagger of Venomous Promises',
      description: 'A poisoned blade that cuts through both flesh and trust.',
      type: 'weapon',
      image: '/images/betrayar/weapon.png',
      value: 60,
      base_percentage: 40,
      min_lvl: 2,
      die_faces: 100,
      die_modifier: 0,
      die_num: 1,
      isUnique: true,
      isActive: false,
    },
  },
  inventory: { healing_potions: [], antidote_potions: [], enhancer_potions: [] },
  status: { ethaziumCurse: false, common_diseases: [], tired: false },
};

export const attributesMock: Modifier = 
{
  charisma: 130,
  constitution: 60,
  dexterity: 23,
  insanity: 95,
  intelligence: 29,
  strength: 18,
  resistance: 100,
  attack: -30,
  hit_points: 35,
  defense: 97,
  magic_resistance: 159,
  CFP: 95,
  BCFA: 113,
};


export const sortedLoyalsAndBetrayersMock: DividedPlayers = 
{
  kaotika: [
    {
      _id: '66decc4ff42d4a193db77e71',
      name: 'AITOR MENDIBURU BOTAS',
      nickname: 'Dr Github',
      avatar: 'https://lh3.googleusercontent.com/a/ACg8ocIs9M5Fz0Dg1M7KgxcDGVyUSOeCIrXQmEVToR9cipfo71RLlOE=s96-c',
      email: 'aitor.mendiburu@ikasle.aeg.eus',
      level: 18,
      role: 'acolyte',
      socketId: '3o0LeOf-R28YvEMhAAAB',
      isBetrayer: true,
      profile: { name: 'Blasphemer' },
      attributes: {
        charisma: 130,
        constitution: 60,
        dexterity: 23,
        insanity: 95,
        intelligence: 29,
        strength: 18,
        resistance: 100,
        attack: -30,
        hit_points: 35,
        defense: 97,
        magic_resistance: 159,
        CFP: 95,
        BCFA: 113,
      },
      base_attributes: {
        charisma: 130,
        constitution: 60,
        dexterity: 23,
        insanity: 95,
        intelligence: 29,
        strength: 18,
        resistance: 100,
        attack: -30,
        hit_points: 35,
        defense: 97,
        magic_resistance: 159,
        CFP: 95,
        BCFA: 113,
      },
      equipment: {
        healing_potion: {
          modifiers: {
            hit_points: 40,
            intelligence: -5,
            dexterity: 0,
            constitution: 0,
            insanity: 0,
            charisma: 0,
            strength: 0,
          },
          _id: '668bca125319ea9afdff0754',
          name: 'Essence of Rejuvenation',
          description: 'This revitalizing potion restores energy and vitality to the drinker.',
          type: 'essence',
          image: '/images/equipment/potions/healing/healing_2.png',
          value: 10,
          min_lvl: 1,
        },
        antidote_potion: {
          _id: '668bca125319ea9afdff075e',
          name: 'Antidote of Frostbane Fever',
          description: 'A potent concoction brewed from the rare Lumina flowers that only bloom under the full moon...',
          type: 'antidote',
          image: '/images/equipment/potions/antidote/antidote_1.png',
          value: 10,
          recovery_effect: {
            modifiers: {
              hit_points: 0,
              intelligence: 0,
              dexterity: 0,
              insanity: 0,
              charisma: -8,
              constitution: -12,
              strength: 0,
            },
            _id: '6693fd5846527d0df5f0efe8',
            name: 'Frostbane Fever',
            description: 'A chilling illness that lowers the body temperature drastically, causing frost to form on the skin and organs to freeze.',
            type: 'illness',
            antidote_effects: ['restore_constitution', 'lesser_restore_charisma'],
            poison_effects: ['damage_constitution', 'lesser_damage_charisma'],
          },
          min_lvl: 1,
        },
        enhancer_potion: {
          modifiers: {
            intelligence: 0,
            dexterity: 0,
            constitution: 0,
            insanity: 20,
            charisma: 0,
            strength: 0,
          },
          _id: '668bca135319ea9afdff076b',
          name: 'Elixir of Madness',
          description:
            'A dangerous brew that plunges the drinker into a frenzy, this potion unleashes chaotic energy.',
          type: 'elixir',
          image: '/images/equipment/potions/enhancer/enhancer_2.png',
          value: 10,
          duration: 2,
          min_lvl: 1,
        },
        weapon: {
          modifiers: {
            intelligence: 0,
            dexterity: 0,
            constitution: 5,
            insanity: 30,
            charisma: 10,
            strength: 0,
          },
          _id: '67616050317c38e05431c530',
          name: 'Dagger of Venomous Promises',
          description: 'A poisoned blade that cuts through both flesh and trust.',
          type: 'weapon',
          image: '/images/betrayar/weapon.png',
          value: 60,
          base_percentage: 40,
          min_lvl: 2,
          die_faces: 100,
          die_modifier: 0,
          die_num: 1,
          isUnique: true,
          isActive: false,
        },
      },
      inventory: { healing_potions: [], antidote_potions: [], enhancer_potions: [] },
      status: { ethaziumCurse: false, common_diseases: [], tired: false },
    },
  ],
  dravocar: [{
    _id: '66dec6ab4c27dff822d80066',
    name: 'ENEKO LARREA PEREZ',
    nickname: '六四事件1989',
    avatar: 'https://lh3.googleusercontent.com/a-/ALV-UjW79byZC_JXJCJrG0AsR_UyQdUoLxTi5YQ5W-4oD4UbHC1NI3Mo',
    email: 'eneko.larrea@ikasle.aeg.eus',
    level: 18,
    role: 'acolyte',
    socketId: 'xmfysZuwGKGtsc0IAAAD',
    isBetrayer: false,
    profile: { name: 'Gossiper' },
    attributes: {
      charisma: 99,
      constitution: 53,
      dexterity: 81,
      insanity: 34,
      intelligence: 107,
      strength: 30,
      resistance: 100,
      attack: 13,
      hit_points: 117,
      defense: 187,
      magic_resistance: 206,
      CFP: 34,
      BCFA: 64,
    },
    base_attributes: {
      charisma: 99,
      constitution: 53,
      dexterity: 81,
      insanity: 34,
      intelligence: 107,
      strength: 30,
      resistance: 100,
      attack: 13,
      hit_points: 117,
      defense: 187,
      magic_resistance: 206,
      CFP: 34,
      BCFA: 64,
    },
    equipment: {
      healing_potion: {
        modifiers: {
          hit_points: 20,
          intelligence: 0,
          dexterity: 0,
          constitution: 0,
          insanity: 0,
          charisma: 0,
          strength: 0,
        },
        _id: '668bca125319ea9afdff0750',
        name: 'Essence of Vitality',
        description: 'A rejuvenating potion that restores vigor and vitality to the drinker.',
        type: 'essence',
        image: '/images/equipment/potions/healing/healing_1.png',
        value: 10,
        min_lvl: 1,
      },
      antidote_potion: {
        _id: '668bca125319ea9afdff0764',
        name: 'Antidote of Wailing Plague',
        description:
          'A cooling elixir brewed from the leaves of the Frostmind plant, alleviating migraines and clearing hallucinations.',
        type: 'antidote',
        image: '/images/equipment/potions/antidote/antidote_3.png',
        value: 10,
        recovery_effect: {
          modifiers: {
            hit_points: 0,
            intelligence: 0,
            dexterity: 0,
            insanity: 7,
            charisma: -9,
            constitution: 0,
            strength: 0,
          },
          _id: '6693fd5846527d0df5f0efe9',
          name: 'Wailing Plague',
          description:
            'An infectious disease that causes the afflicted to uncontrollably wail in pain, spreading misery and despair.',
          type: 'illness',
          antidote_effects: ['lesser_restore_insanity', 'lesser_restore_charisma'],
          poison_effects: ['lesser_damage_insanity', 'lesser_damage_charisma'],
        },
        min_lvl: 1,
      },
      enhancer_potion: {
        modifiers: {
          intelligence: 0,
          dexterity: 0,
          constitution: 0,
          insanity: 20,
          charisma: 0,
          strength: 0,
        },
        _id: '668bca135319ea9afdff076b',
        name: 'Elixir of Madness',
        description:
          'A dangerous brew that plunges the drinker into a frenzy, this potion unleashes chaotic energy.',
        type: 'elixir',
        image: '/images/equipment/potions/enhancer/enhancer_2.png',
        value: 10,
        duration: 2,
        min_lvl: 1,
      },
      weapon: {
        modifiers: {
          intelligence: 0,
          dexterity: 0,
          constitution: 5,
          insanity: 30,
          charisma: 10,
          strength: 0,
        },
        _id: '67616050317c38e05431c530',
        name: 'Dagger of Venomous Promises',
        description: 'A poisoned blade that cuts through both flesh and trust.',
        type: 'weapon',
        image: '/images/betrayar/weapon.png',
        value: 60,
        base_percentage: 40,
        min_lvl: 2,
        die_faces: 100,
        die_modifier: 0,
        die_num: 1,
        isUnique: true,
        isActive: false,
      },
    },
    inventory: { healing_potions: [], antidote_potions: [], enhancer_potions: [] },
    status: { ethaziumCurse: false, common_diseases: [], tired: false },
  },],
};
