import { changeTurn } from '../../helpers/game.ts';
import { handleTurnTimerExpiration } from '../../timer/timer.ts';

jest.mock('../../helpers/game', () => ({
  changeTurn: jest.fn(),
}));

describe('test handleTurnTimerExpiration', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should call changeTurn when turnTime is 0', () => {
    // Arrange
    const turnTime = 0;   
    // act
    handleTurnTimerExpiration(turnTime);
    // assert
    expect(changeTurn).toHaveBeenCalled();
  });

  it('it should not call changeTurn when turnTime is not 0', () => {
    // Arrange
    const turnTime = 5;
    // act
    handleTurnTimerExpiration(turnTime);
    // assert
    expect(changeTurn).not.toHaveBeenCalled();
  });
});