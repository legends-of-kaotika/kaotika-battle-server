import { luckRolls, hasLuck,applyDefenseLuck, defenderLuck} from '../../helpers/luck.ts';
import { LuckDefender } from '../../interfaces/LuckDefender.ts';

// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.spyOn(require('../../helpers/luck'), 'luckRolls').mockImplementation(() => [10, 15, 20]);
// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.spyOn(require('../../helpers/luck'), 'hasLuck').mockImplementation(() => true);
// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.spyOn(require('../../helpers/luck'), 'applyDefenseLuck').mockImplementation(() => ({
  dealedDamage: 150,
  luckMessage: 'Defender reduced damage!',
}));


describe('defenderLuck', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return modified damage and a luck message when defender has luck', () => {
    const originalDealedDamage = 50;
    const defender = { attributes: { charisma: 10 } } as LuckDefender;

    (luckRolls as jest.Mock).mockReturnValue([10, 15, 20]);
    (hasLuck as jest.Mock).mockReturnValue(true);
    (applyDefenseLuck as jest.Mock).mockReturnValue({ dealedDamage: 25, luckMessage: 'Defender reduced damage' });

    const result = defenderLuck(originalDealedDamage, defender);

    expect(luckRolls).toHaveBeenCalledWith(defender.attributes.charisma);
    expect(hasLuck).toHaveBeenCalledWith([10, 15, 20]);
    expect(applyDefenseLuck).toHaveBeenCalledWith(originalDealedDamage, defender);
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

    (luckRolls as jest.Mock).mockReturnValue([3, 4, 2]);
    (hasLuck as jest.Mock).mockReturnValue(false);

    const result = defenderLuck(originalDealedDamage, defender);

    expect(luckRolls).toHaveBeenCalledWith(defender.attributes.charisma);
    expect(hasLuck).toHaveBeenCalledWith([3, 4, 2]);
    expect(applyDefenseLuck).not.toHaveBeenCalled();
    expect(result).toEqual({
      hasLuck: false,
      luckRolls: [3, 4, 2],
      dealedDamage: 50,
      luckMessage: 'The defender has no luck',
    });
  });
});
