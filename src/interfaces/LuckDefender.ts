import { Equipment } from './Equipment.ts';

export type DefenderReduced = {
    _id: string,
    attributes: {
      charisma: number,
      defense: number
    }
    equipment: Equipment
};