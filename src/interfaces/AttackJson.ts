import { Percentages } from './Percentages.ts';

export type AttackJson = {
  attack: {
    targetPlayerId: string,
    hit_points: number,
    percentages: Percentages,
    dieRoll: number,
    dealedDamage: number,
    attackType: string
  },
  luck: {
    attacker: {
      hasLuck: boolean,
      luckRolls: number[],
      luckRollMessage?: string | undefined,
    },
    defender: {
      hasLuck: boolean,
      luckRolls: number[],
      luckRollMessage: string | undefined,
    }
  }
};

