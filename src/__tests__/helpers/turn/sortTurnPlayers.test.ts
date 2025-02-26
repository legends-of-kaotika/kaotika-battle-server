import { GAME_USERS_MOCK } from '../../../__mocks__/players.ts';
import { sortTurnPlayers } from '../../../helpers/turn.ts';
import { Player } from '../../../interfaces/Player.ts';


//-----------------------------methods helpers-------------------------------//

const usersWithSameCharisma = (users: Player[])=> {
  return users.map((user)=> ({
    ...user,
    attributes: {
      ...user.attributes,
      charisma: 100
    }
  }));
};


const checkIfPrevAttributesHigher = (users: Player[]): boolean => (
  users.every((user) => {
    const indexOfUser = users.findIndex((userIndex)=> (userIndex === user));
    if (indexOfUser === 0) return true;

    const prevUser = users[indexOfUser - 1];
    if (user.attributes.charisma < prevUser.attributes.charisma) return true;
    if (user.attributes.charisma > prevUser.attributes.charisma) return false;
    if (user.attributes.charisma === prevUser.attributes.charisma && user.attributes.dexterity < prevUser.attributes.dexterity) return true;
    if (user.attributes.charisma === prevUser.attributes.charisma && user.attributes.dexterity > prevUser.attributes.dexterity) return false;
  })
);

//------------------------------------------------------------------------------//

const playersTurnSuccessesMock1 = {
  '66decc4ff42d4a193db77e11': 2,
  '66decc4ff42d4a193db77e71': 5,
  '66dec6ab4c27dff822d80066': 3
};

const playersTurnSuccessesMock2 = {
  '66decc4ff42d4a193db77e11': 5,
  '66decc4ff42d4a193db77e71': 5,
  '66dec6ab4c27dff822d80066': 3
};

const onlineUsersMock = [...GAME_USERS_MOCK]; 
const onlineUsersWithSameCharisma = usersWithSameCharisma(onlineUsersMock);

describe('sortTurnPlayers method', ()=> {
  it('should order the players correctly if different successes', ()=> {
    sortTurnPlayers(playersTurnSuccessesMock1, onlineUsersMock);
    const playersIdSorted = onlineUsersMock.map((player)=> player._id);

    expect(playersIdSorted).toStrictEqual(['66decc4ff42d4a193db77e71', '66dec6ab4c27dff822d80066', '66decc4ff42d4a193db77e11']);
  }); 
  it('should order the players correctly in case of same successes', ()=> {
    sortTurnPlayers(playersTurnSuccessesMock2, onlineUsersMock);
    const playersIdSorted = onlineUsersMock.map((player)=> player._id);
    const isCharismaOrDexterityLower = checkIfPrevAttributesHigher(onlineUsersMock);

    expect(playersIdSorted).toStrictEqual(['66decc4ff42d4a193db77e71', '66decc4ff42d4a193db77e11', '66dec6ab4c27dff822d80066']);
    expect(isCharismaOrDexterityLower).toBe(true);
  });
  it('should order the players correctly in case of same successes and same charisma', ()=> {
    sortTurnPlayers(playersTurnSuccessesMock2, onlineUsersWithSameCharisma);
    const playersIdSorted = onlineUsersMock.map((player)=> player._id);
    const isDexterityLower = checkIfPrevAttributesHigher(onlineUsersMock);

    expect(playersIdSorted).toStrictEqual(['66decc4ff42d4a193db77e71', '66decc4ff42d4a193db77e11', '66dec6ab4c27dff822d80066']);
    expect(isDexterityLower).toBe(true);

  });
});

