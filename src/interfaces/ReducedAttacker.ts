import { Weapon } from "./Weapon.ts";

export interface ReducedAttacker {
  attributes: {
    BCFA: number,
    attack: number,
    charisma: number
  },
  weapon: Weapon,
}
