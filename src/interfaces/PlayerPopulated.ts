import { Artifact } from './Artifact.ts';
import { Armor } from './Armor.ts';
import { Weapon } from './Weapon.ts';
import { Profile } from './Profile.ts';
import { Helmet } from './Helmet.ts';
import { Shield } from './Shield.ts';
import { Boot } from './Boot.ts';
import { Ring } from './Ring.ts';
import { Attribute } from './Attribute.ts';
import { Task } from './Task.ts';
import { HealingPotion } from './HealingPotion.ts';
import { AntidotePotion } from './AntidotePotion.ts';
import { EnhancerPotion } from './EnhancerPotion.ts';
import { Ingredient } from './Ingredients.ts';

export interface PlayerPopulated {
  _id: string;
  name: string;
  nickname: string;
  avatar: string;
  email: string;
  experience: number;
  level: number;
  gold: number;
  is_active: boolean;
  created_date: string;
  profile: Profile | null;
  attributes: Attribute;
  classroom_id: string | null;
  isBetrayer: boolean;
  equipment:{
    helmet: Helmet,
    weapon: Weapon,
    armor: Armor,
    shield: Shield,
    artifact: Artifact,
    boot: Boot,
    ring: Ring | null,
    healing_potion: HealingPotion,
    antidote_potion: AntidotePotion,
    enhancer_potion: EnhancerPotion,
  },
  inventory: {
    helmets: Helmet[],
    weapons: Weapon[],
    armors: Armor[],
    shields: Shield[],
    artifacts: Artifact[],
    boots: Boot[],
    rings: Ring[],
    ingredients: Ingredient[],
    healing_potions: HealingPotion[],
    antidote_potions: AntidotePotion[],
    enhancer_potions: EnhancerPotion[],
  },
  tasks: Task[]
}
