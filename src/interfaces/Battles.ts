import { PlayerPopulated } from './PlayerPopulated.ts';

export interface Battle {
  _id: string;
  name: string;
  description: string;
  enemies: PlayerPopulated[];
  suggested_level: number;
  drop_item_level: number;
  gold: number;
  exp: number;
  battle_background: string;
  battle_animations: string[];
  end_of_battle_background: string[];
};

