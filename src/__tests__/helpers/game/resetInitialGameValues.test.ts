import { currentPlayer, idPlayerFirstTurn, isGameCreated, isGameStarted, resetInitialGameValues, round, selectedBattleId, target, turn } from '../../../game.ts';
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
    expect(selectedBattleId).toBe(null);
    expect(isGameCreated).toBe(false);
  });
}); 