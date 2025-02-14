import { Equipment } from './Equipment.ts';

export type LuckDefender = {
    _id: string,
    attributes: {
      charisma: number,
      defense: number
    }
    equipment: Equipment
};