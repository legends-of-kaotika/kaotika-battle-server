import { Equipment } from "./Equipment.ts"

export interface ReducedAttacker {
  attributes: {
    BCFA: number,
    attack: number,
    charisma: number
  },
  equipment: Equipment
}
