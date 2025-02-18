import { Attribute } from './Attribute.ts';
import { FumbleDamage, Fumble } from './Fumble.ts';
import { Percentages } from './Percentages.ts';

export type AttackJson = {
  attack: {
    targetPlayerId: string,
    attributes: Attribute,
    percentages: Percentages,
    dieRoll: number,
    dealedDamage: FumbleDamage | null,
    attackType: string
    fumble: Fumble | undefined
  },
  luck?: {
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
  },
};

