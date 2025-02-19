import { Die2 } from '../constants/dies.ts';
import { Player } from '../interfaces/Player.ts';

//---------------------------helpers----------------------------------------------//
export const getNumOfTurnRolls = (playerCharisma: number , playerDexterity: number): number => {
  return Math.ceil((playerCharisma + playerDexterity / 2) / 20);
};

export const getPlayerTurnSuccesses = (turnNumOfDieRolls: number): number => {
  let numOfSuccesses = 0;
  for (let i = 0; i < turnNumOfDieRolls; ++i) {
    const rollResult = Die2.roll();
    if (rollResult === 2) {numOfSuccesses ++;};
  }
  return numOfSuccesses;
};

export const getPlayersTurnSuccesses = (onlineUsers: Player[]): Record<string, number> => {
  let outputObject = {};
  onlineUsers.forEach((player) => {
    const numbOfTurnRolls = getNumOfTurnRolls(player.attributes.charisma, player.attributes.dexterity);
    const numOfSuccesses = getPlayerTurnSuccesses(numbOfTurnRolls);
    outputObject = { ...outputObject, [player._id]: numOfSuccesses };
  });
  return outputObject;
};


//----------------------------------final method------------------------------//

export const sortTurnPlayers = (playersTurnSuccesses: Record<string, number>, onlineUsers: Player[]) => {

  onlineUsers.sort((player1, player2) => {

    const player1Successes = playersTurnSuccesses[player1._id]; // number
    const player2Successes = playersTurnSuccesses[player2._id]; // number
    
    if (player1Successes !== player2Successes) {

      // sort by successes
      return player2Successes - player1Successes;

    } else {
      // sort by charisma or dexterity

      if (player1.attributes.charisma !== player2.attributes.charisma) {
        // sort by charisma
        return player2.attributes.charisma - player1.attributes.charisma ;

      } else {
        // sort by dexterity
        return player2.attributes.dexterity - player1.attributes.dexterity ;
      }
    }
  });
};