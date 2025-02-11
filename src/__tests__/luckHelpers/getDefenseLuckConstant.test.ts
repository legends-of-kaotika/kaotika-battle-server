import { DEFENSE_LUCK_EFFECTS } from '../../constants/game.ts';
import { getDefenseLuckConstant } from '../../helpers/luck.ts';

describe('test getDefenseLuckConstant', () => {
  it('should return the correct constant FOR NO DAMAGE_RECEIVED', () => {
    const luckConstant = getDefenseLuckConstant(6);
    expect(luckConstant).toBe(DEFENSE_LUCK_EFFECTS.NO_DAMAGE_RECEIVED);
  });

  it('should return the correct constant FOR NO_EFFECTS', () => {
    const luckConstant = getDefenseLuckConstant(34);
    expect(luckConstant).toBe(DEFENSE_LUCK_EFFECTS.NO_EFFECTS);
  });

  it('should return the correct constant FOR NO DAMAGE_RECEIVED', () => {
    const luckConstant = getDefenseLuckConstant(98);
    expect(luckConstant).toBe(DEFENSE_LUCK_EFFECTS.START_NEXT_ROUND);
  });
});