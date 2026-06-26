import { BATTLES } from '../game.ts';
import { Battle } from '../interfaces/Battles.ts';
import { WebBattle } from '../interfaces/WebBattle.ts';

const buildMediaUrl = (baseUrl: string | undefined, path: string): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base = (baseUrl || '').replace(/\/+$/, '');
  const cleanPath = path.replace(/^\/+/, '');
  return `${base}/${cleanPath}`;
};

const resolveBattleMediaUrls = (battle: Battle): Battle => {
  const baseUrl = process.env.KAOTIKA_VERCEL;
  return {
    ...battle,
    battle_background: buildMediaUrl(baseUrl, battle.battle_background),
    battle_video_background: buildMediaUrl(baseUrl, battle.battle_video_background),
    battle_animations: battle.battle_animations.map((anim) => buildMediaUrl(baseUrl, anim)),
    end_of_battle_background: battle.end_of_battle_background.map((bg) => buildMediaUrl(baseUrl, bg)),
  };
};

export const findBattleById = (_id: string): Battle | undefined => {
  const battle = BATTLES.find((battle) => battle._id === _id);
  return battle;
};

export const findResolvedBattleById = (_id: string): Battle | undefined => {
  const battle = findBattleById(_id);
  if (!battle) return undefined;
  return resolveBattleMediaUrls(battle);
};

export const parseWebBattleData = (battle: Battle): WebBattle => {
  const webBattleData = { ...battle } as WebBattle;
  webBattleData.enemies = battle.enemies?.map(({ _id, name, avatar }) => ({ _id, name, avatar }));
  return webBattleData;
};

export const getResolvedBattles = (battles: Battle[]): Battle[] => {
  return battles.map(resolveBattleMediaUrls);
};
