import { BATTLES } from '../game.ts';
import { Battle } from '../interfaces/Battles.ts';

export const findBattleById = (_id: string): Battle | undefined => {
  const battle = BATTLES.find((battle) => battle._id === _id);
  return battle;
};