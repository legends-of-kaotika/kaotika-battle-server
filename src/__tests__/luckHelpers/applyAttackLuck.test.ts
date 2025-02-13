import { applyAttackLuck } from '../../helpers/luck.ts';
import { Die100 } from '../../constants/dies.ts';
import { playerMock } from '../../__mocks__/players.ts';
import { Player } from '../../interfaces/Player.ts';

jest.mock('../../constants/dies.ts', () => ({
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
    expect(result).toEqual({rollMessage: 'The luck roll has no effect', dealedDamage: 40});
  });
  
  it('should increase normal attack damage if roll is between 15-59', () => {
    (Die100.roll as jest.Mock).mockReturnValue(40); 
    const result = applyAttackLuck(8, 'NORMAL', 20, 15, 30, attacker, defender);
    expect(result).toEqual({rollMessage: 'The attack has been increased +0', dealedDamage: 8});
  });

  it('should increase normal attack damage if roll is between 15-59', () => {
    (Die100.roll as jest.Mock).mockReturnValue(40); 
    attacker.attributes.attack = 65;
    const result = applyAttackLuck(20, 'NORMAL', 20, 15, 30, attacker, defender);
    expect(result).toEqual({rollMessage: 'The attack has been increased +3', dealedDamage: 23});
  });

  it('should not transform a attack that is not normal into a critical when roll is between 15-59', () => {
    
    (Die100.roll as jest.Mock).mockReturnValue(75); 
    
    const failedAttackLuck = applyAttackLuck(0, 'FAILED', 20, 15, 30, attacker, defender);
    expect(failedAttackLuck).toEqual({ dealedDamage: 0, rollMessage: 'The luck roll has no effect' });

    const fumbleAttackLuck = applyAttackLuck(10, 'FUMBLE', 20, 15, 30, attacker, defender);
    expect(fumbleAttackLuck).toEqual({ dealedDamage: 10, rollMessage: 'The luck roll has no effect' });
    
    const normalAttackLuck = applyAttackLuck(20, 'CRITICAL', 20, 15, 30, attacker, defender);
    expect(normalAttackLuck).toEqual({ dealedDamage: 20, rollMessage: 'The luck roll has no effect' });

  });

  it('should transform a normal attack into a critical if roll is between 59-80', () => {
    (Die100.roll as jest.Mock).mockReturnValue(75); 
    const result = applyAttackLuck(20, 'NORMAL', 20, 15, 30, attacker, defender);
    expect(result).toEqual({ dealedDamage: 37, rollMessage: 'The attack has been transformed into critical (+17)' });
  });

  it('should make the attacker start first the next round if roll is over 80', () => {
    (Die100.roll as jest.Mock).mockReturnValue(85); 
    const result = applyAttackLuck(20, 'NORMAL', 20, 15, 30, attacker, defender);
    expect(result).toEqual({ dealedDamage: 20, rollMessage: 'The player will start first in the next round' });
  });
 
});
