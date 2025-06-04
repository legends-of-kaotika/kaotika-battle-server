import { Socket } from 'socket.io';
import { MOBILE } from '../constants/sockets.ts';
import { idPlayerFirstTurn, GAME_USERS, setIdPlayerFirstTurn, CONNECTED_USERS } from '../game.ts';
import { Attribute } from '../interfaces/Attribute.ts';
import { FumbleDamage } from '../interfaces/Fumble.ts';
import { Player } from '../interfaces/Player.ts';
import { PlayerPopulated } from '../interfaces/PlayerPopulated.ts';
import { sendKilledPlayer, sendPlayerDisconnectedToWeb, sendPlayerRemoved } from '../sockets/emits/user.ts';
import { logUnlessTesting } from './utils.ts';

// Returns a player searched by id in connected users
export const findConnectedPlayerById = (_id: string): Player | undefined => {
  const user = CONNECTED_USERS.find((player) => player._id === _id);
  return user;
};

// Returns a player searched by id
export const findPlayerById = (_id: string): Player | undefined => {
  const user = GAME_USERS.find((player) => player._id === _id);
  return user;
};

// Returns a player searched by socketid
export const findPlayerBySocketId = (id: string): Player | undefined => {
  const user = GAME_USERS.find((player) => player.socketId === id);
  return user;
};

// Removes the player that got disconnected from playerConnected[] global variable
export const removePlayerConnected = (socket: Socket): void => {

  let userInfo: { email: string; _id: string; nickname: string } | undefined;

  // Remove from GAME_USERS if exists.
  const gameUsersIndex = GAME_USERS.findIndex(user => user.socketId === socket.id);
  if (gameUsersIndex !== -1) {
    userInfo = GAME_USERS[gameUsersIndex];
    GAME_USERS.splice(gameUsersIndex, 1);
    console.log('Player ' + userInfo.nickname + ' removed from GAME_USERS');
    console.log('Online Users:');
    GAME_USERS.forEach( user => console.log(user.name));
  }

  // Remove from CONNECTED_USERS if exists.
  const connectedUsersIndex = CONNECTED_USERS.findIndex(user => user.socketId === socket.id);
  if (connectedUsersIndex !== -1) {
    userInfo = CONNECTED_USERS[connectedUsersIndex];
    CONNECTED_USERS.splice(connectedUsersIndex, 1);
    console.log('Player ' + userInfo.nickname + ' removed from CONNECTED_USERS');
  }

  if (userInfo) {
    console.log(`${userInfo.email} has disconnected`);
    socket.leave(MOBILE);
    sendPlayerRemoved(userInfo._id);
    sendPlayerDisconnectedToWeb(userInfo.nickname);
  } else {
    console.log('No players found with the received socket');
  }
};

// Returns a player searched by email
export const findPlayerByEmail = (email: string): Player | undefined => {
  const user = GAME_USERS.find((player) => player.email === email);
  return user;
};

export const isPlayerAlive = (id: string): boolean => {
  return GAME_USERS.some((player) => player._id === id);
};

export const isPlayerConnected = (id: string): boolean => {
  return CONNECTED_USERS.some((player) => player._id === id);
};

export function handlePlayerDeath(id: string): void {

  const isConnected = isPlayerAlive(id);
  if (!isConnected) return;

  sendKilledPlayer(id);
  removePlayerFromGameUsersById(id);
  
  // If the dead player started first in the next round due to the luck, remove the condition.
  if (idPlayerFirstTurn === id) setIdPlayerFirstTurn(null);
}

export function removePlayerFromGameUsersById(id: string): void {
  const index = GAME_USERS.findIndex(player => player._id === id);
  if (index === -1) {
    logUnlessTesting(`FAILED to delete player with the id ${id} dont exist in ONLINE USER array`);
    return;
  }
  GAME_USERS.splice(index, 1);
}

export const findPlayerDeadId = (): string | null => {
  const player = GAME_USERS.find(({attributes}) => attributes.hit_points <= 0 );
  if(!player) return null;
  return player._id;
};

export const applyDamage = (id: string, damage: FumbleDamage | null): void => {
  const player = findPlayerById(id);
  if (damage) {
    const attributeKey = Object.keys(damage)[0] as keyof Attribute;
    const attributeValue = Object.values(damage)[0];
    if (player) { player.attributes[attributeKey] -= attributeValue; }
  };
};

export const modifyAttributes = (id: string, modifiedAttributes: Partial<Attribute>) : void => {

  const player = findPlayerById(id);

  if (player) {
    player.attributes = { ...player.attributes, ...modifiedAttributes};
  }
};

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




