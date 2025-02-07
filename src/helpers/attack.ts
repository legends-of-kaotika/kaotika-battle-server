import { Player } from '../interfaces/Player';

export const adjustAtributes = (player: Player): Player => {

  //----ATTRIBUTES----
  // Every attribute has to be rounded to integer
  player.attributes.insanity = Math.round(player.attributes.insanity);
  player.attributes.attack = Math.round(player.attributes.attack);
  player.attributes.defense = Math.round(player.attributes.defense);
  player.attributes.intelligence = Math.round(player.attributes.intelligence);
  player.attributes.dexterity = Math.round(player.attributes.dexterity);
  player.attributes.constitution = Math.round(player.attributes.constitution); 
  player.attributes.charisma = Math.round(player.attributes.charisma);
  player.attributes.strength = Math.round(player.attributes.strength);
  player.attributes.hit_points = Math.round(player.attributes.hit_points);
  player.attributes.magic_resistance = Math.round(player.attributes.magic_resistance);
  player.attributes.CFP = Math.round(player.attributes.CFP);
  player.attributes.BCFA = Math.round(player.attributes.BCFA);
  player.attributes.resistance = Math.round(player.attributes.resistance);
  //INS: min 1 - max 100
  player.attributes.insanity = Math.max(1, Math.min(100, player.attributes.insanity));
 
  //Remaining attributes will have a minimum value of 0
  player.attributes.defense = Math.max(0, player.attributes.defense);
  player.attributes.intelligence = Math.max(0, player.attributes.intelligence);
  player.attributes.dexterity = Math.max(0, player.attributes.dexterity);
  player.attributes.constitution = Math.max(0, player.attributes.constitution); 
  player.attributes.charisma = Math.max(0, player.attributes.charisma);
  player.attributes.strength = Math.max(0, player.attributes.strength);
  player.attributes.hit_points = Math.max(0, player.attributes.hit_points);
  player.attributes.magic_resistance = Math.max(0, player.attributes.magic_resistance);
  player.attributes.CFP = Math.max(0, player.attributes.CFP);
  player.attributes.BCFA = Math.max(0, player.attributes.BCFA);
  player.attributes.resistance = Math.max(0, player.attributes.resistance);
  return player;
};

export const getCriticalPercentage = (player: Player, successPercentage: number) => {
  // Formula: CRIT% = CFP * SUCCESS% / 100 (result rounded up)
  return Math.ceil(player.attributes.CFP*successPercentage/100);
};