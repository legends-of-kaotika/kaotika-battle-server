import { Modifier } from "./Modifier"

export interface Boot {
  _id: string,
  name: string,
  description: string,
  type: string,
  image: string,
  value: number,
  defense: number,
  modifiers: Modifier,
  min_lvl: number,
  isUnique: boolean,
  isActive: boolean
}