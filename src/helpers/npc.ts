import { GAME_USERS, NPCS, setTarget } from '../game.ts';
import { Player } from '../interfaces/Player.ts';
import { PlayerPopulated } from '../interfaces/PlayerPopulated.ts';
import { sendConnectedUsersArrayToWeb, sendSelectedPlayerIdToWeb } from '../sockets/emits/user.ts';
import { attackFlow } from './game.ts';
import { parsePlayerData } from './player.ts';
import { logUnlessTesting, sleep } from './utils.ts';

export const fetchNPCs = async () : Promise<void> => {
  
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
    NPCS.push(npc);
    GAME_USERS.push(npc);
  });
  
  console.log(`${npcArray.length} NPCs have joined to the game.`);
  sendConnectedUsersArrayToWeb(GAME_USERS);

};

export const selectKaotikaPlayerRandom = (): Player | undefined => {
  const kaotikaPlayers = GAME_USERS.filter(player => !player.isBetrayer);
  if (kaotikaPlayers.length === 0){
    return undefined;
  }
  return kaotikaPlayers[Math.floor(Math.random() * kaotikaPlayers.length)];
};

export const npcAttack = async () : Promise<void> => {
  
  logUnlessTesting('Entered npcAttack() function...');
  
  await sleep(2000);
  logUnlessTesting('The NPC is selecting a player to attack...');
  const npcSelectedPlayer = selectKaotikaPlayerRandom();

  if (npcSelectedPlayer) {
    setTarget(npcSelectedPlayer);
    sendSelectedPlayerIdToWeb(npcSelectedPlayer);
    logUnlessTesting(`The NPC selected ${npcSelectedPlayer.nickname}`);
    await sleep(3000);
    attackFlow(npcSelectedPlayer._id);
  }
};

export const addBattleNPCsToGame = (npcs: PlayerPopulated[]) => {

  npcs.forEach((fullNPC: PlayerPopulated) => {
    const npc = parsePlayerData(fullNPC);
    npc.role = 'npc';
    npc.avatar = `${process.env.KAOTIKA_VERCEL}/${npc.avatar}`;
    NPCS.push(npc);
    GAME_USERS.push(npc);
  });
  
};