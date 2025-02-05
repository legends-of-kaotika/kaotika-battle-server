import { AntidoteModifier } from './AntidoteModifier';

export interface Weapon {
  _id: string,
  name: string,
  description: string,
  type: string,
  image: string,
  die_faces: number,
  die_modifier: number,
  die_num: number,
  base_percentage: number,
  modifiers: AntidoteModifier,
  min_lvl: number,
  value: number,
  isUnique: boolean,
  isActive: boolean,
}