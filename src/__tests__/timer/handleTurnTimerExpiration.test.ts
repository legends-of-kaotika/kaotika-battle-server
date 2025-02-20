import { changeTurn } from '../../helpers/game.ts';
import { sleep, logUnlessTesting } from '../../helpers/utils.ts';
import { handleTurnTimerExpiration } from '../../timer/timer.ts';

jest.mock('../../helpers/game', () => ({
  changeTurn: jest.fn(),
}));

jest.mock('../../helpers/utils', () => ({
  sleep: jest.fn(),
  logUnlessTesting: jest.fn(),
}));

describe('test handleTurnTimerExpiration', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should call changeTurn when turnTime is 0', async() => {
    // Arrange
    const turnTime = 0;   
    // act
    await handleTurnTimerExpiration(turnTime);
    // assert
    expect(sleep).toHaveBeenCalledWith(5000);
    expect(changeTurn).toHaveBeenCalled();
    expect(logUnlessTesting).toHaveBeenCalled();
  });

  it('it should not call changeTurn when turnTime is not 0', async() => {
    // Arrange
    const turnTime = 5;
    // act
    await handleTurnTimerExpiration(turnTime);
    // assert
    expect(sleep).not.toHaveBeenCalled();
    expect(changeTurn).not.toHaveBeenCalled();
    expect(logUnlessTesting).not.toHaveBeenCalled();
  });
});