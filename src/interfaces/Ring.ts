import { Attribute } from './Attribute.ts';

export interface Ring {
  _id: string,
  name: string,
  description: string,
  type: string,
  image: string,
  value: number,
  modifiers: Attribute,
  min_lvl: number,
}