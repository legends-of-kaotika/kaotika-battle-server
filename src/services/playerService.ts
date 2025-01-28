const Player = require("../models/playerSchema");
import { Player } from "../interfaces/Player";
import {PlayerPopulated} from "../interfaces/PlayerPopulated";
import { Modifier } from "../interfaces/Modifier";


const filterPlayerData = (data: PlayerPopulated): Player => {
  const player: Player  = {
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
    attributes: data.attributes || {
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
      die_faces: 0,
      die_modifier: 0,
      die_num: 0,
      base_percentage: 0,
    },
    base_attributes: data.attributes || {
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
      die_faces: 0,
      die_modifier: 0,
      die_num: 0,
      base_percentage: 0,
    },
    equipment: {
      healing_potion: data.equipment?.healing_potion || {},
      antidote_potion: data.equipment?.antidote_potion || {},
      enhancer_potion: data.equipment?.enhancer_potion || {},
    },
    inventory: {
      healing_potions: data.inventory?.healing_potions || [],
      antidote_potions: data.inventory?.antidote_potions || [],
      enhancer_potions: data.inventory?.enhancer_potions || [],
    },
      status: {
        ethaziumCurse: false,
        common_diseases: [],
        tired: false
      },
  };
  return player;
};

const assignRole = (email: String) => {
  switch (email) {
    case process.env.ISTVAN_EMAIL:
      return 'istvan'
    case process.env.VILLAIN_EMAIL:
      return 'villain'
    case process.env.MORTIMER_EMAIL:
      return 'mortimer'
    default:
      return 'acolyte'
  }
}
const initFetchPlayer = async (email: String) => {
  try {
    const queryResponse = await fetch(`https://kaotika-server.fly.dev/players/email/${email}/`);
    const userData = await queryResponse.json();
    const role = assignRole(userData.data.email);

    let user = filterPlayerData(userData.data);
    user.role = role;

    console.log('Email: ', email);
    console.log('Role: ', role);

    const existingPlayer = await Player.findOne({ email: user.email });

    let player;
    if (!existingPlayer) {
      // ADD TO COLLECTION
      player = new Player(user);
      await player.save();
      console.log('Added new player: ', player);
    } else {
      // MERGE TO COLLECTION
      Object.assign(existingPlayer, user);
      await existingPlayer.save();
      player = existingPlayer;
    }

    return player;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


module.exports = { initFetchPlayer };

