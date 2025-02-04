import { AntidotePotion } from './AntidotePotion';
import { HealingPotion } from './HealingPotion';
import { EnhancerPotion } from './EnhancerPotion';
import { Profile } from './Profile';
import { Modifier } from './Modifier';
import { Status } from './Status';
import { Weapon } from './Weapon';

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