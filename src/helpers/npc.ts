import { io } from '../../index.ts';
import { PlayerPopulated } from '../interfaces/PlayerPopulated.ts';
import { parsePlayerData } from './player.ts';
import { NPCS, GAME_USERS, setTarget } from '../game.ts';
import { Player } from '../interfaces/Player.ts';
import { logUnlessTesting, sleep } from './utils.ts';
import { sendConnectedUsersArrayToWeb, sendSelectedPlayerIdToWeb } from '../sockets/emits/user.ts';
import { attackFlow } from './game.ts';
import { Battle } from '../interfaces/Battles.ts';


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
    NPCS.push(npc);
    GAME_USERS.push(npc);
  });
  
  console.log(`${npcArray.length} NPCs have joined to the game.`);
  sendConnectedUsersArrayToWeb(io, GAME_USERS);

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
    sendSelectedPlayerIdToWeb(io, npcSelectedPlayer);
    logUnlessTesting(`The NPC selected ${npcSelectedPlayer.nickname}`);
    await sleep(3000);
    attackFlow(npcSelectedPlayer._id);
  }
};

export const addBattleNPCsToGame = (battle: Battle) => {

  const npcs: Player[] = battle.enemies;
  npcs.forEach((fullNPC: Player) => {
    const npc = fullNPC;
    npc.role = 'npc';
    npc.avatar = `${process.env.KAOTIKA_VERCEL}/${npc.avatar}`;
    NPCS.push(npc);
    ONLINE_USERS.push(npc);
  });
};