import { Modifier } from "./Modifier"

export interface Artifact {
  _id: string,
  name: string, 
  description: string,
  type: string
  image: string,
  value: number,
  modifiers: Modifier,
  min_lvl: number,
  isUnique: boolean,
  isActive: boolean
}