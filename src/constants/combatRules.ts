import { DEFENSE_LUCK_EFFECTS } from './game.ts';

export const DEFENSE_RULES = [
  {max: 100, value: 0},
  {max: 150, value: 2},
  {max: 200, value: 3},
  {max: 275, value: 4},
  {max: 350, value: 5},
  {max: 400, value: 6},
  {max: Infinity, value: 7},
];
export const INSANITY_RULES = [
  {max:34, value:-5},
  {max:79, value:0},
  {max:84, value:5},
  {max:89, value:7},
  {max:94, value:10},
  {max:Infinity, value:15},
];
export const ATTACK_RULES_MOD1 = [
  {max:-20, value:0.8},
  {max:-11, value:0.9},
  {max:0, value:1},
  {max:19, value:1.1},
  {max:44, value:1.15},
  {max:60, value:1.2},
  {max:Infinity, value:1.25},
];
export const ATTACK_RULES_MOD2 = [
  {max:-20, value:0},
  {max:-11, value:2},
  {max:0, value:4},
  {max:19, value:6},
  {max:44, value:10},
  {max:60, value:15},
  {max:Infinity, value:15},
];

export const DEFENSE_LUCK_RULES = [
  {max: 15, value: DEFENSE_LUCK_EFFECTS.NO_DAMAGE_RECEIVED},
  {max: 80, value: DEFENSE_LUCK_EFFECTS.NO_EFFECTS},
  {max: 100, value: DEFENSE_LUCK_EFFECTS.START_NEXT_ROUND},
];