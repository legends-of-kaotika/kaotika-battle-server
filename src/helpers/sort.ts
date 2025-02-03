import { Player } from '../interfaces/Player';

//returns an array of players sorted by their charisma
export const sortPlayersByCharisma = (players: Player[]): Player[] => {
  //sort characters by charisma
  players.sort((c1, c2) =>
    c1.attributes.charisma < c2.attributes.charisma
      ? 1
      : c1.attributes.charisma > c2.attributes.charisma
        ? -1
        : 0);
  return players;
};
