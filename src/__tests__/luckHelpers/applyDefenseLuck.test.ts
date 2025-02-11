import { DEFENSE_LUCK_EFFECTS } from '../../constants/game.ts';
import { getDefenseLuckConstant } from '../../helpers/luck.ts';


describe('test the applyDefenseLuck function', () => {
  it('should return the correct constant for  the luckRoll', () => {
    const luckConstant = getDefenseLuckConstant(89);
    expect(luckConstant).toBe(DEFENSE_LUCK_EFFECTS.START_NEXT_ROUND);
  });

  
});