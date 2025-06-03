import { Attribute } from './Attribute.ts';
import { FumbleWeb } from './Fumble.ts';
import { Percentages } from './Percentages.ts';
import { DealedDamage } from './DealedDamage.ts';

export type AttackJson = {
  attack: {
    targetPlayerId: string,
    attributes: Attribute,
    percentages: Percentages,
    dieRoll: number,
    dealedDamage: DealedDamage | null,
    attackType: string
    fumble: FumbleWeb | null
  },
  luck?: {
    attacker: {
      hasLuck: boolean,
      luckRolls: number[],
      luckRollMessage?: string | undefined,
      noEffect: boolean,
    },
    defender: {
      hasLuck: boolean,
      luckRolls: number[],
      luckRollMessage: string | undefined,
      noEffect: boolean,
    }
  },
};

