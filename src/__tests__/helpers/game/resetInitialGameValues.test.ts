import { currentPlayer, isGameStarted, ONLINE_USERS, resetInitialGameValues, round, target, turn } from '../../../game.ts';
import { turnTime } from '../../../timer/timer.ts';

describe('test the resetInitialGameValues', () => {
  it('should reset the game values', () => {
    resetInitialGameValues();
    expect(isGameStarted).toBe(false);
    expect(ONLINE_USERS).toHaveLength(0);
    expect(target).toBe(undefined);
    expect(currentPlayer).toBe(undefined);
    expect(turn).toBe(0);
    expect(round).toBe(1);
    expect(turnTime).toBe(30);
  });
}); 