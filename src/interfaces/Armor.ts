import { Modifier } from "./Modifier"

export interface Armor {
  _id: string,
  name: string,
  description: string,
  type: string,
  image: string,
  defense: number,
  value: number,
  modifiers: Modifier,
  min_lvl: number,
  isUnique: boolean,
  isActive: boolean
}