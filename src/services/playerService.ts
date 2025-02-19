import { Player } from '../interfaces/Player.ts';
import { PlayerPopulated } from '../interfaces/PlayerPopulated.ts';
import { Attribute } from '../interfaces/Attribute.ts';

const calculateBaseAttributes = (data: PlayerPopulated): Attribute => {
  const equipmentModifiers: Attribute[] = [
    data.equipment.helmet?.modifiers,
    data.equipment.weapon?.modifiers,
    data.equipment.armor?.modifiers,
    data.equipment.shield?.modifiers,
    data.equipment.artifact?.modifiers,
    data.equipment.boot?.modifiers,
    data.equipment.ring?.modifiers,
  ].filter((modifier): modifier is Attribute => modifier !== undefined);

  const calculateAttribute = (attribute: keyof Attribute): number => {
    const baseValue = data.attributes[attribute] || 0;
    const equipmentValue = equipmentModifiers.reduce((sum, modifier) => sum + (modifier[attribute] || 0),
      0);
    return baseValue + equipmentValue;
  };

  return {
    charisma: calculateAttribute('charisma'),
    constitution: calculateAttribute('constitution'),
    dexterity: calculateAttribute('dexterity'),
    insanity: calculateAttribute('insanity'),
    intelligence: calculateAttribute('intelligence'),
    strength: calculateAttribute('strength'),
    resistance: 100,
    attack: 0,
    hit_points: 0,
    defense: 0,
    magic_resistance: 0,
    CFP: 0,
    BCFA: 0,
  };
};

export const calculateHitPoints = (attributes: Attribute): number => {
  return Math.floor(attributes.constitution + attributes.dexterity - attributes.insanity / 2);
};

export const calculateAttack = (attributes: Attribute): number => {
  return Math.floor(attributes.strength - attributes.insanity / 2);
};

export const calculateDefense = (attributes: Attribute): number => {
  return Math.floor(attributes.dexterity + attributes.constitution + attributes.intelligence / 2);
};

export const calculateMagicResistance = (attributes: Attribute): number => {
  return Math.floor(attributes.intelligence + attributes.charisma);
};

export const calculateCFP = (attributes: Attribute): number => {
  return attributes.insanity;
};

export const calculateBCFA = (attributes: Attribute): number => {
  return Math.floor(attributes.strength + attributes.insanity);
};

export const parsePlayerData = (data: PlayerPopulated): Player => {
  const baseAttributes = calculateBaseAttributes(data);

  const calculatedAttributes = {
    ...baseAttributes,
    hit_points: calculateHitPoints(baseAttributes),
    attack: calculateAttack(baseAttributes),
    defense: calculateDefense(baseAttributes),
    magic_resistance: calculateMagicResistance(baseAttributes),
    CFP: calculateCFP(baseAttributes),
    BCFA: calculateBCFA(baseAttributes),
  };

  const player: Player = {
    _id: data._id,
    name: data.name || '',
    nickname: data.nickname || '',
    avatar: data.avatar || '',
    email: data.email || '',
    level: data.level || 0,
    role: assignRole(data.email) || '',
    socketId: '',
    isBetrayer: data.isBetrayer,
    profile: data.profile
      ? {
        name: data.profile.name || '',
      }
      : null,
    attributes: calculatedAttributes,
    base_attributes: calculatedAttributes || {
      intelligence: 0,
      dexterity: 0,
      insanity: 0,
      charisma: 0,
      constitution: 0,
      strength: 0,
      resistance: 100,
      attack: 0,
      hit_points: 0,
      defense: 0,
      magic_resistance: 0,
      CFP: 0,
      BCFA: 0,
    },
    equipment: {
      healing_potion: data.equipment?.healing_potion || {},
      antidote_potion: data.equipment?.antidote_potion || {},
      enhancer_potion: data.equipment?.enhancer_potion || {},
      weapon: data.equipment?.weapon || {},
      helmet: data.equipment.helmet,
      boot: data.equipment.boot,
      armor: data.equipment.armor,
      shield: data.equipment.shield,
    },
    inventory: {
      healing_potions: data.inventory?.healing_potions || [],
      antidote_potions: data.inventory?.antidote_potions || [],
      enhancer_potions: data.inventory?.enhancer_potions || [],
    },
    status: {
      ethaziumCurse: false,
      common_diseases: [],
      tired: false,
    },
    isAlive : true
  };
  return player;
};

export const assignRole = (email: string) => {
  switch (email) {
  case process.env.ISTVAN_EMAIL:
    return 'istvan';
  case process.env.VILLAIN_EMAIL:
    return 'villain';
  case process.env.MORTIMER_EMAIL:
    return 'mortimer';
  default:
    return 'acolyte';
  }
};

export const initFetchPlayer = async (email: string) => {
  try {
    console.log('initFetchPlayer()');
    console.log(`${process.env.KAOTIKA_SERVER}/players/email/${email}/`);
    const queryResponse = await fetch(`${process.env.KAOTIKA_SERVER}/players/email/${email}/`);
    const userData = await queryResponse.json();
    if (userData.status === 'NOT FOUND'){
      console.log(`player with email: ${email} not found`);
      return undefined;
    }

    const user = parsePlayerData(userData.data);
    console.log('New User Created:');
    console.log('Email: ', email);
    console.log('Role: ', user.role);

    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
