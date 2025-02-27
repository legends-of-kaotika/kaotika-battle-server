import { BATTLES } from '../game.ts';
import { Battle } from '../interfaces/Battles.ts';
import { WebBattle } from '../interfaces/WebBattle.ts';

export const findBattleById = (_id: string): Battle | undefined => {
  const battle = BATTLES.find((battle) => battle._id === _id);
  return battle;
};

export const parseWebBattleData = (battle: Battle): WebBattle => {
  const webBattleData = { ...battle } as WebBattle;
  webBattleData.enemies = battle.enemies?.map(({ _id, name, avatar }) => ({ _id, name, avatar }));
  return webBattleData;
};
