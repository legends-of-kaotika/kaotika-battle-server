import { ATTACK_LUCK_EFFECTS, DEFENSE_LUCK_EFFECTS, FUMBLE_EFFECTS } from './game.ts';
import { AttackTypes } from '../interfaces/AttackTypes.ts';
import { ATTACK_INCREASE } from './messages.ts';

export const ATTACK_TYPES: Record<string, AttackTypes> = {
  NORMAL: 'NORMAL',
  CRITICAL: 'CRITICAL',
  FUMBLE: 'FUMBLE',
  FAILED: 'FAILED'
};

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
  {max:34, value:0},
  {max:79, value:5},
  {max:84, value:10},
  {max:Infinity, value:12},
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

export const ATTACK_LUCK_RULES = [
  {max: 15, value: ATTACK_LUCK_EFFECTS.NO_EFFECTS},
  {max: 35, value: ATTACK_LUCK_EFFECTS.NORMAL_ATTACK_INCREASE},
  {max: 80, value: ATTACK_LUCK_EFFECTS.NORMAL_TO_CRITICAL},
  {max: Infinity, value: ATTACK_LUCK_EFFECTS.NEXT_ROUND_START_FIRST},
];

export const CRITICAL_MOD1 = [
  { max: 7, value: 5},
  { max: 14, value: 3},
  { max: 24, value: 2},
  { max: 40, value: 2},
  { max: 60, value: 1},
  { max: Infinity, value: 0},
];

export const CRITICAL_MOD2 = [
  { max: 7,  value: 0 },
  { max: 14, value: 2 },
  { max: 24, value: 1 },
  { max: 40, value: 0 },
  { max: 60,  value: 0 },
  { max: Infinity, value: 0 },
];

export const ATTACK_RULES_LUCK_MOD = [
  {max: Infinity, value: 1.6}
];

export const EFFECTS_FUMBLE = [
  {max: 30, effect: FUMBLE_EFFECTS.SLASH},
  {max: 60, effect: FUMBLE_EFFECTS.LIGHTSMASH},
  {max: 85, effect: FUMBLE_EFFECTS.SMASH},
  {max: Infinity, effect: FUMBLE_EFFECTS.HACK}
];
export const LUCK_ATTACK_INCREEASE = [
  {max: Infinity, effect: ATTACK_INCREASE.BIG},
];

export const DEFENSE_MOD = [
  // att 1-9
  {min_att: 1, max_att: 9, min_def: 550, max_def: Infinity, mult: null, minDamageChance: 0},
  {min_att: 1, max_att: 9, min_def: 450, max_def: 549,      mult: null, minDamageChance: 0},
  {min_att: 1, max_att: 9, min_def: 350, max_def: 449,      mult: null, minDamageChance: 0},
  {min_att: 1, max_att: 9, min_def: 250, max_def: 349,      mult: null, minDamageChance: 0},
  {min_att: 1, max_att: 9, min_def: 150, max_def: 249,      mult: null, minDamageChance: 0},
  {min_att: 1, max_att: 9, min_def: 20,  max_def: 149,      mult: null, minDamageChance: 0},
  {min_att: 1, max_att: 9, min_def: 1,   max_def: 19,       mult: 0.25, minDamageChance: 100},
  // att 10-34
  {min_att: 10, max_att: 34, min_def: 550, max_def: Infinity, mult: null, minDamageChance: 0},
  {min_att: 10, max_att: 34, min_def: 450, max_def: 549,      mult: 5,    minDamageChance: 50},
  {min_att: 10, max_att: 34, min_def: 350, max_def: 449,      mult: 3.2,  minDamageChance: 50},
  {min_att: 10, max_att: 34, min_def: 250, max_def: 349,      mult: 2.8,  minDamageChance: 50},
  {min_att: 10, max_att: 34, min_def: 150, max_def: 249,      mult: 2.4,  minDamageChance: 100},
  {min_att: 10, max_att: 34, min_def: 20,  max_def: 149,      mult: 2,    minDamageChance: 100},
  {min_att: 10, max_att: 34, min_def: 1,   max_def: 19,       mult: 1.5,  minDamageChance: 100},
  // att 35-59
  {min_att: 35, max_att: 59, min_def: 550, max_def: Infinity, mult: 3.6, minDamageChance: 30},
  {min_att: 35, max_att: 59, min_def: 450, max_def: 549,      mult: 3.1, minDamageChance: 30},
  {min_att: 35, max_att: 59, min_def: 350, max_def: 449,      mult: 2.6, minDamageChance: 100},
  {min_att: 35, max_att: 59, min_def: 250, max_def: 349,      mult: 2.4, minDamageChance: 100},
  {min_att: 35, max_att: 59, min_def: 150, max_def: 249,      mult: 2.1, minDamageChance: 100},
  {min_att: 35, max_att: 59, min_def: 20,  max_def: 149,      mult: 1.8, minDamageChance: 100},
  {min_att: 35, max_att: 59, min_def: 1,   max_def: 19,       mult: 1.5, minDamageChance: 100},
  // att 60-119
  {min_att: 60, max_att: 119, min_def: 550, max_def: Infinity, mult: 3,   minDamageChance: 100},
  {min_att: 60, max_att: 119, min_def: 450, max_def: 549,      mult: 2.8, minDamageChance: 100},
  {min_att: 60, max_att: 119, min_def: 350, max_def: 449,      mult: 2.7, minDamageChance: 100},
  {min_att: 60, max_att: 119, min_def: 250, max_def: 349,      mult: 2.4, minDamageChance: 100},
  {min_att: 60, max_att: 119, min_def: 150, max_def: 249,      mult: 2,   minDamageChance: 100},
  {min_att: 60, max_att: 119, min_def: 20,  max_def: 149,      mult: 1.7, minDamageChance: 100},
  {min_att: 60, max_att: 119, min_def: 1,   max_def: 19,       mult: 1,   minDamageChance: 100},
  // att 120-179
  {min_att: 120, max_att: 179, min_def: 550, max_def: Infinity, mult: 2.8, minDamageChance: 100},
  {min_att: 120, max_att: 179, min_def: 450, max_def: 549,      mult: 2.6, minDamageChance: 100},
  {min_att: 120, max_att: 179, min_def: 350, max_def: 449,      mult: 2.4, minDamageChance: 100},
  {min_att: 120, max_att: 179, min_def: 250, max_def: 349,      mult: 2.2, minDamageChance: 100},
  {min_att: 120, max_att: 179, min_def: 150, max_def: 249,      mult: 1.8, minDamageChance: 100},
  {min_att: 120, max_att: 179, min_def: 20,  max_def: 149,      mult: 1.4, minDamageChance: 100},
  {min_att: 120, max_att: 179, min_def: 1,   max_def: 19,       mult: 0.5, minDamageChance: 100},
  // att +180
  {min_att: 180, max_att: Infinity, min_def: 550, max_def: Infinity, mult: 3.3, minDamageChance: 100},
  {min_att: 180, max_att: Infinity, min_def: 450, max_def: 549,      mult: 2.7, minDamageChance: 100},
  {min_att: 180, max_att: Infinity, min_def: 350, max_def: 449,      mult: 2,   minDamageChance: 100},
  {min_att: 180, max_att: Infinity, min_def: 250, max_def: 349,      mult: 1.3, minDamageChance: 100},
  {min_att: 180, max_att: Infinity, min_def: 150, max_def: 249,      mult: 0.7, minDamageChance: 100},
  {min_att: 180, max_att: Infinity, min_def: 20,  max_def: 149,      mult: 0.3, minDamageChance: 100},
  {min_att: 180, max_att: Infinity, min_def: 1,   max_def: 19,       mult: 0.1, minDamageChance: 100}
];
