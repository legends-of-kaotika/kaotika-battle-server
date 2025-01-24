import { Modifier } from "./Modifier"

export interface Helmet {
  _id: string,
  name: string,
  description: string,
  type: string,
  value: number,
  defense: number,
  image: string,
  modifiers: Modifier,
  min_lvl: number,
  isUnique: boolean,
  isActive: boolean
}