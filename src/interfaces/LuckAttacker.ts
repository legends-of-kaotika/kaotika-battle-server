import { Equipment } from "./Equipment.ts";

export type LuckAttacker = {
    _id: string,
    attributes: {
      charisma: number,
      BCFA: number,
      attack: number
    },
    equipment: Equipment
};