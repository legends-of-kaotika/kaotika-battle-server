import { GAME_USERS, NPCS, setTarget } from '../game.ts';
import { Battle } from '../interfaces/Battles.ts';
import { Player } from '../interfaces/Player.ts';
import { PlayerPopulated } from '../interfaces/PlayerPopulated.ts';
import { sendSelectedPlayerIdToWeb } from '../sockets/emits/user.ts';
import { attackFlow } from './game.ts';
import { parsePlayerData } from './player.ts';
import { logUnlessTesting, sleep } from './utils.ts';

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

export const addBattleNPCsToGame = (battle: Battle) => {

  const npcs: PlayerPopulated[] = battle.enemies;
  npcs.forEach((fullNPC: PlayerPopulated) => {
    const npc = parsePlayerData(fullNPC);
    npc.role = 'npc';
    npc.avatar = `${process.env.KAOTIKA_VERCEL}/${npc.avatar}`;
    NPCS.push(npc);
    GAME_USERS.push(npc);
  });
};