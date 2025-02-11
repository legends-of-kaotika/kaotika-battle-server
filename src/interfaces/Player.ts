import { AntidotePotion } from './AntidotePotion.ts';
import { HealingPotion } from './HealingPotion.ts';
import { EnhancerPotion } from './EnhancerPotion.ts';
import { Profile } from './Profile.ts';
import { Attribute } from './Attribute.ts';
import { Status } from './Status.ts';
import { Equipment } from './Equipment.ts';

export interface Player {
  _id: string;
  name: string;
  nickname: string;
  avatar: string;
  email: string;
  level: number;
  socketId: string;
  profile: Profile | null;
  attributes: Attribute;
  base_attributes: Attribute;
  equipment: Equipment,
  inventory: {
    healing_potions: HealingPotion[],
    antidote_potions: AntidotePotion[],
    enhancer_potions: EnhancerPotion[],
  },
  status: Status,
  role: string,
  isBetrayer: boolean,
}