import { currentPlayer, idPlayerFirstTurn, isGameStarted, resetInitialGameValues, round, target, turn } from '../../../game.ts';
import { turnTime } from '../../../timer/timer.ts';

describe('test the resetInitialGameValues', () => {
  it('should reset the game values', () => {
    resetInitialGameValues();
    expect(isGameStarted).toBe(false);
    expect(target).toBe(undefined);
    expect(currentPlayer).toBe(undefined);
    expect(turn).toBe(-1);
    expect(round).toBe(1);
    expect(turnTime).toBe(30);
    expect(idPlayerFirstTurn).toBe(null);
  });
}); 