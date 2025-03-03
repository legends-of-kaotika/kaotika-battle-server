import { Battle } from '../interfaces/Battles.ts';
import { NPCS_MOCK } from './helpers/player/npcMock.ts';

export const battles: Battle[] = 
    [
      {
        _id: '8367893',
        name: 'Forgotten Tavern',
        description: 'In search of Angelo, a dark secret lurks in the shadows of the tavern.',
        enemies: NPCS_MOCK,
        suggested_level: 7,
        drop_item_level: 7,
        gold: 300,
        exp: 1500,
        battle_background: 'tabern.webp',
        battle_animations: ['player.gif', 'boss.gif'],
        end_of_battle_background: ['victory.webp', 'defeat.webp']
      },
      {
        _id: '765325',
        name: 'The Profane Ritual',
        description: 'A coven of warlocks has summoned horrors from beyond the veil. Stop them before it’s too late.',
        enemies: NPCS_MOCK,
        suggested_level: 10,
        drop_item_level: 10,
        gold: 500,
        exp: 2500,
        battle_background: 'ritual.webp',
        battle_animations: ['player.gif', 'warlock.gif', 'demon.gif'],
        end_of_battle_background: ['victory.webp', 'defeat.webp']
      }
    ];