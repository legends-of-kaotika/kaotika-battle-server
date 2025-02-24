import { Missions } from '../interfaces/Missions.ts';

export const missions: Missions[] = 
    [
      {
        name: 'Forgotten Tavern',
        description: 'In search of Angelo, a dark secret lurks in the shadows of the tavern.',
        enemies: ['boss_id', 'boos_id'],
        suggested_level: 7,
        drop_item_level: 7,
        gold: 300,
        exp: 1500,
        battle_background: 'tabern.webp',
        battle_animations: ['player.gif', 'boss.gif'],
        end_of_battle_background: ['victory.webp', 'defeat.webp']
      },
      {
        name: 'The Profane Ritual',
        description: 'A coven of warlocks has summoned horrors from beyond the veil. Stop them before it’s too late.',
        enemies: ['warlock_id', 'demon_id'],
        suggested_level: 10,
        drop_item_level: 10,
        gold: 500,
        exp: 2500,
        battle_background: 'ritual.webp',
        battle_animations: ['player.gif', 'warlock.gif', 'demon.gif'],
        end_of_battle_background: ['victory.webp', 'defeat.webp']
      }];