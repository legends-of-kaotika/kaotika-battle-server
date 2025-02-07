import { AntidoteModifier } from './AntidoteModifier.ts';

export interface EnhancerPotion {
  _id: string,
  name: string,
  description: string,
  image: string,
  type: string,
  value: number,
  duration: number,
  modifiers: AntidoteModifier,
  min_lvl: number
}