import { resetInitialGameValues } from '../../game.ts';
import { isGameStarted, ONLINE_USERS, target, currentPlayer, turn, round } from '../../game.ts';

describe('test the resetInitialGameValues', () => {
  it('should reset the game values', () => {
    resetInitialGameValues();
    expect(isGameStarted).toBe(false);
    expect(ONLINE_USERS).toHaveLength(0);
    expect(target).toBe(undefined);
    expect(currentPlayer).toBe(undefined);
    expect(turn).toBe(0);
    expect(round).toBe(1);
  });
});