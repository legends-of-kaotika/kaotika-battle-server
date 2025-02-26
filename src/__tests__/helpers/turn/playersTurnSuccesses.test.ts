import { GAME_USERS_MOCK } from '../../../__mocks__/players.ts';
import { getPlayersTurnSuccesses } from '../../../helpers/turn.ts';

const onlineUsersCopyMock = [...GAME_USERS_MOCK];

describe ('getPlayersTurnSuccesses method', ()=> {
  it('should return object with many id with their value', ()=> {
    const playersTurnSuccesses = getPlayersTurnSuccesses(onlineUsersCopyMock);
    //check if all keys are string
    const allKeysAreString = Object.keys(playersTurnSuccesses).every((key)=> (typeof key === 'string'));
    //check if all values are number 
    const allValuesAreNumber = Object.values(playersTurnSuccesses).every((value)=> (typeof value === 'number'));
    //check if keys length is same as array length
    const isObjectLengthCorrect =  Object.keys(playersTurnSuccesses).length === onlineUsersCopyMock.length;
    
    expect(allKeysAreString).toBe(true);
    expect(allValuesAreNumber).toBe(true);
    expect(isObjectLengthCorrect).toBe(true);
  });
});