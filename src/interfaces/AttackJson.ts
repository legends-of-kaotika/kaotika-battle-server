import { Attribute } from './Attribute.ts';
import { Damage, Fumble } from './Fumble.ts';
import { Percentages } from './Percentages.ts';

export type AttackJson = {
  attack: {
    targetPlayerId: string,
    attributes: Attribute,
    percentages: Percentages,
    dieRoll: number,
    dealedDamage: Damage | null,
    attackType: string
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
  fumble?: Fumble
};

