import { Modifier } from "./Modifier";

export interface EnhancerPotion {
  _id: string,
  name: string,
  description: string,
  image: string,
  type: string,
  value: number,
  duration: number,
  modifiers: Modifier,
  min_lvl: number
}