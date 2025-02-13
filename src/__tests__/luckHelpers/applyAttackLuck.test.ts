import { applyAttackLuck } from '../../helpers/luck.ts';
import { ATTACK_LUCK_EFFECTS } from '../../constants/game.ts';
import { Die100 } from '../../constants/dies.ts';
import { getAttackLuckConstant } from '../../helpers/luck.ts';

jest.mock('../../constants/dies.ts', () => ({
  Die100: { roll: jest.fn() }
}));

jest.mock('../../helpers/luck.ts', () => ({
  getAttackLuckConstant: jest.fn(),
}));

jest.mock('../../helpers/attack.ts', () => ({
  getCriticalHitDamage: jest.fn(),
  getNormalHitDamage: jest.fn(),
  getValueFromRule: jest.fn()
}));

  
describe('applyAttackLuck', () => {

  // let attacker;
  // let defender;

  beforeEach(() => {
    jest.clearAllMocks();
    // attacker = playerMock;
    // defender = playerMock;
  });
  
  it('should return no effect when NO_EFFECTS is rolled', () => {
    (Die100.roll as jest.Mock).mockReturnValue(50);
    (getAttackLuckConstant as jest.Mock).mockReturnValue(ATTACK_LUCK_EFFECTS.NO_EFFECTS);
    
    const result = applyAttackLuck(100, 'NORMAL', 5, 10, 20);
    expect(result).toEqual({ dealedDamage: 100, rollMessage: 'The luck roll has no effect' });
  });
  
  // it('should transform a normal attack into a critical', () => {
  //   Die100.roll.mockReturnValue(20);
  //   getAttackLuckConstant.mockReturnValue(ATTACK_LUCK_EFFECTS.NORMAL_TO_CRITICAL);
  //   getCriticalHitDamage.mockReturnValue(200);
    
  //   const result = applyAttackLuck(100, 'NORMAL', 5, 10, 20);
  //   expect(result).toEqual({ hitDamage: 200, rollMessage: 'The attack has been transformed into critical.' });
  // });
  
  // it('should increase normal attack damage', () => {
  //   Die100.roll.mockReturnValue(30);
  //   getAttackLuckConstant.mockReturnValue(ATTACK_LUCK_EFFECTS.NORMAL_ATTACK_INCREASE);
  //   getValueFromRule.mockReturnValue(5);
  //   getNormalHitDamage.mockReturnValue(120);
    
  //   const result = applyAttackLuck(100, 'NORMAL', 5, 10, 20);
  //   expect(result).toEqual({ hitDamage: 120, rollMessage: 'The attack has been increased +20' });
  // });
});
