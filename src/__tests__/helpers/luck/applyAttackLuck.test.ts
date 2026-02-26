import { playerMock } from '../../../__mocks__/players.ts';
import { Die100 } from '../../../constants/dies.ts';
import { applyAttackLuck } from '../../../helpers/luck.ts';
import { Player } from '../../../interfaces/Player.ts';

jest.mock('../../../constants/dies.ts', () => ({
  Die100: {
    roll: jest.fn(),
  },
}));

describe('applyAttackLuck', () => {

  let attacker: Player;
  let defender: Player;

  beforeEach(() => {
    jest.clearAllMocks();
    attacker = playerMock;
    defender = playerMock;
  });
  
  it('should execute no effect case when number is below 15', () => {
    (Die100.roll as jest.Mock).mockReturnValue(12); 
    const result = applyAttackLuck(40, 'NORMAL', 30, 15, 30, attacker, defender);
    expect(result).toEqual({luckMessage: 'The luck roll has no effect', dealedDamage: 40});
  });
  
  it('should increase normal attack damage if roll is between 15-59', () => {
    (Die100.roll as jest.Mock).mockReturnValue(30); 
    const result = applyAttackLuck(8, 'NORMAL', 20, 15, 30, attacker, defender);
    expect(result).toEqual({luckMessage: 'The attack has been increased significantly!', dealedDamage: 13});
  });

  it('should increase normal attack damage if roll is between 15-59', () => {
    (Die100.roll as jest.Mock).mockReturnValue(30); 
    attacker.attributes.attack = 65;
    const result = applyAttackLuck(20, 'NORMAL', 20, 15, 30, attacker, defender);
    expect(result).toEqual({luckMessage: 'The attack has been increased significantly!', dealedDamage: 32});
  });

  it('should not transform a attack that is not normal into a critical when roll is between 15-59', () => {
    
    (Die100.roll as jest.Mock).mockReturnValue(75); 
    
    const failedAttackLuck = applyAttackLuck(0, 'FAILED', 20, 15, 30, attacker, defender);
    expect(failedAttackLuck).toEqual({ dealedDamage: 0, luckMessage: 'The luck roll has no effect' });

    const fumbleAttackLuck = applyAttackLuck(10, 'FUMBLE', 20, 15, 30, attacker, defender);
    expect(fumbleAttackLuck).toEqual({ dealedDamage: 10, luckMessage: 'The luck roll has no effect' });
    
    const normalAttackLuck = applyAttackLuck(20, 'CRITICAL', 20, 15, 30, attacker, defender);
    expect(normalAttackLuck).toEqual({ dealedDamage: 20, luckMessage: 'The luck roll has no effect' });

  });

  it('should transform a normal attack into a critical if roll is between 59-80', () => {
    (Die100.roll as jest.Mock).mockReturnValue(75); 
    const result = applyAttackLuck(100, 'NORMAL', 20, 15, 30, attacker, defender);
    expect(result.luckMessage).toBe('The attack has been transformed into critical');
    expect(result.dealedDamage).toBeGreaterThanOrEqual(213);
    expect(result.dealedDamage).toBeLessThanOrEqual(713);
  });

  it('should make the attacker start first the next round if roll is over 84', () => {
    (Die100.roll as jest.Mock).mockReturnValue(85); 
    const result = applyAttackLuck(20, 'NORMAL', 20, 15, 30, attacker, defender);
    expect(result).toEqual({ dealedDamage: 20, luckMessage: 'The player will start first in the next round' });
  });
 
});
