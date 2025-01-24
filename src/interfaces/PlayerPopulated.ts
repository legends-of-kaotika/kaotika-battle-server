import { Artifact } from "./Artifact";
import { Armor } from "./Armor";
import { Weapon } from "./Weapon";
import { Profile } from "./Profile";
import { Helmet } from "./Helmet";
import { Shield } from "./Shield";
import { Boot } from "./Boot";
import { Ring } from "./Ring";
import { Modifier } from "./Modifier";
import { Task } from "./Task";
import { Ingredient } from "./Ingredients";

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
  attributes: Modifier;
  classroom_id: string | null;
  equipment:{
    helmet: Helmet | null,
    weapon: Weapon,
    armor: Armor,
    shield: Shield | null,
    artifact: Artifact,
    boot: Boot | null,
    ring: Ring | null,
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
  },
  tasks: Task[]
}

export interface PlayerPopulatedDocument extends PlayerPopulated, Document {
  // You can add any custom methods if needed
}