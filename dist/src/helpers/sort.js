"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortPlayersByCharisma = void 0;
//returns an array of players sorted by their charisma
const sortPlayersByCharisma = (players) => {
    //sort characters by charisma
    players.sort((c1, c2) => c1.attributes.charisma < c2.attributes.charisma
        ? 1
        : c1.attributes.charisma > c2.attributes.charisma
            ? -1
            : 0);
    return players;
};
exports.sortPlayersByCharisma = sortPlayersByCharisma;
