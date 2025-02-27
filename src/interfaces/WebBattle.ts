import { PlayerPopulated } from './PlayerPopulated.ts';

export interface WebBattle {
  _id: string;
  name: string;
  description: string;
  enemies: Partial<PlayerPopulated>[];
  suggested_level: number;
  drop_item_level: number;
  gold: number;
  exp: number;
  battle_background: string;
  battle_animations: string[];
  end_of_battle_background: string[];
};

