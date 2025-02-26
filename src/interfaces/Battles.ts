import { Player } from './Player.ts';

export interface Battle {
        id: string;
        name: string;
        description: string;
        enemies: Player[];
        suggested_level: number;
        drop_item_level: number;
        gold: number;
        exp: number;
        battle_background: string;
        battle_animations: string[];
        end_of_battle_background: string[];
      };