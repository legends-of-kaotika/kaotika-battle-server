import { Equipment } from './Equipment.ts';

export interface ReducedDefender {
  attributes: {
    defense: number
  },
  equipment: Equipment
}

