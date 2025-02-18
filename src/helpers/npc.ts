import { PlayerPopulated } from '../interfaces/PlayerPopulated.ts';
import { parsePlayerData } from '../services/playerService.ts';
import { ONLINE_USERS } from '../game.ts';
import { Player } from '../interfaces/Player.ts';

export const fetchNPCs = async () => {
  
  console.log('Fetching NPCs...');

  const minLevel = 0;
  const maxLevel = 0;

  const request = await fetch(`${process.env.KAOTIKA_SERVER}/npcs/levels/${minLevel}/${maxLevel}`);
  const response = await request.json();

  const npcArray = response?.data;

  if (response.status === 'NOT FOUND' || npcArray?.length === 0) {
    console.log(`No NPC found with level between ${minLevel} and ${maxLevel}`);
  }

  npcArray.forEach((fullNPC: PlayerPopulated) => {
    const npc = parsePlayerData(fullNPC);
    npc.role = 'npc';
    npc.avatar = `${process.env.KAOTIKA_VERCEL}/${npc.avatar}`;
    ONLINE_USERS.push(npc);
  });

};

export const selectKaotikaPlayerRandom = (): Player | undefined => {
  const kaotikaPlayers = ONLINE_USERS.filter(player => !player.isBetrayer);
  if (kaotikaPlayers.length === 0){
    return undefined;
  }
  return kaotikaPlayers[Math.floor(Math.random() * kaotikaPlayers.length)];
};