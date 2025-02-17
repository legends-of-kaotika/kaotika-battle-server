import { luckRolls, hasLuck,applyDefenseLuck, defenderLuck} from '../../helpers/luck.ts';
import { LuckDefender } from '../../interfaces/LuckDefender.ts';

jest.mock('../../helpers/luck.ts', () => ({
  luckRolls: jest.fn(),
  hasLuck: jest.fn(),
  applyDefenseLuck: jest.fn(),
  defenderLuck: jest.requireActual('../../helpers/luck.ts').defenderLuck,
}));

const mockLuckRolls = luckRolls as jest.Mock;
const mockHasLuck = hasLuck as jest.Mock;
const mockApplyDefenseLuck = applyDefenseLuck as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('defenderLuck', () => {
  it('should return modified damage and a luck message when defender has luck', () => {
    const originalDealedDamage = 50;
    const defender = { attributes: { charisma: 10 } } as LuckDefender;
    mockLuckRolls.mockReturnValue([10, 15, 20]);
    mockHasLuck.mockReturnValue(true);
    mockApplyDefenseLuck.mockReturnValue({ dealedDamage: 25, luckMessage: 'Defender reduced damage' });
    
    const result = defenderLuck(originalDealedDamage, defender);
    
    expect(mockLuckRolls).toHaveBeenCalledWith(defender.attributes.charisma);
    expect(mockHasLuck).toHaveBeenCalledWith([10, 15, 20]);
    expect(mockApplyDefenseLuck).toHaveBeenCalledWith(originalDealedDamage, defender);
    expect(result).toEqual({
      dealedDamage: 25,
      hasLuck: true,
      luckRolls: [10, 15, 20],
      luckMessage: 'Defender reduced damage',
    });
  });

  it('should return original damage and a no luck message when defender has no luck', () => {
    const originalDealedDamage = 50;
    const defender = { attributes: { charisma: 5 } } as LuckDefender;
    
    mockLuckRolls.mockReturnValue([3, 4, 2]);
    mockHasLuck.mockReturnValue(false);
    
    const result = defenderLuck(originalDealedDamage, defender);
    
    expect(mockLuckRolls).toHaveBeenCalledWith(defender.attributes.charisma);
    expect(mockHasLuck).toHaveBeenCalledWith([3, 4, 2]);
    expect(mockApplyDefenseLuck).not.toHaveBeenCalled();
    expect(result).toEqual({
      hasLuck: false,
      luckRolls: [3, 4, 2],
      dealedDamage: 50,
      luckMessage: 'The defender has no luck',
    });
  });
});