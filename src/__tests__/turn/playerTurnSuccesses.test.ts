import { getPlayerTurnSuccesses } from '../../helpers/player.ts';

const numDieRollsMock = 5;

describe ('getPlayerTurnSuccesses', ()=> {
  it('should return a value in a range', ()=> {
    const turnSuccesses = getPlayerTurnSuccesses(numDieRollsMock);
    expect(turnSuccesses).toBeGreaterThanOrEqual(0);
    expect(turnSuccesses).toBeLessThanOrEqual(5);
  });
});