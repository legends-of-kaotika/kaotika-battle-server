import { turnArray, turnPlayerMock } from '../../__mocks__/playerTurns.ts';
import { nextRoundStartFirst } from '../../helpers/game.ts';

describe('test nextRoundStartFirst function' , () => {
  it('should change the turns array correctly', () => {
    
    const newTurnArray = nextRoundStartFirst(turnPlayerMock, turnArray);
    expect(newTurnArray[0]._id).toBe('12345');

  });
});