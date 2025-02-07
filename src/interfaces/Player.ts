import { AntidotePotion } from './AntidotePotion.ts';
import { HealingPotion } from './HealingPotion.ts';
import { EnhancerPotion } from './EnhancerPotion.ts';
import { Profile } from './Profile.ts';
import { Modifier } from './Modifier.ts';
import { Status } from './Status.ts';
import { Weapon } from './Weapon.ts';

export interface Player {
  _id: string;
  name: string;
  nickname: string;
  avatar: string;
  email: string;
  level: number;
  socketId: string;
  profile: Profile | null;
  attributes: Modifier;
  base_attributes: Modifier;
  equipment:{
    weapon: Weapon,
    healing_potion: HealingPotion,
    antidote_potion: AntidotePotion,
    enhancer_potion: EnhancerPotion,
  },
  inventory: {
    healing_potions: HealingPotion[],
    antidote_potions: AntidotePotion[],
    enhancer_potions: EnhancerPotion[],
  },
  status: Status,
  role: string,
  isBetrayer: boolean,
}