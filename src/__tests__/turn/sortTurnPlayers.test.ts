import { ONLINE_USERS_MOCK } from '../../__mocks__/players.ts';
import { sortTurnPlayers } from '../../helpers/player.ts';

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

const onlineUsersMock = [...ONLINE_USERS_MOCK]; 

describe('sortTurnPlayers method', ()=> {
  it('should order the players correctly if different successes', ()=> {
    sortTurnPlayers(playersTurnSuccessesMock1, onlineUsersMock);
    const playersIdSorted = onlineUsersMock.map((player)=> player._id);

    console.log(playersIdSorted);

    expect(playersIdSorted).toStrictEqual(['66decc4ff42d4a193db77e71', '66dec6ab4c27dff822d80066', '66decc4ff42d4a193db77e11']);
  }); 
  it('should order the players correctly in case of same successes', ()=> {
    sortTurnPlayers(playersTurnSuccessesMock2, onlineUsersMock);
    const playersIdSorted = onlineUsersMock.map((player)=> player._id);

    console.log(playersIdSorted);

    expect(playersIdSorted).toStrictEqual(['66decc4ff42d4a193db77e71', '66decc4ff42d4a193db77e11', '66dec6ab4c27dff822d80066']);
  });
});