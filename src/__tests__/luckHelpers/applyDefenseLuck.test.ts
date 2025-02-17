import { playerMock } from '../../__mocks__/players.ts';
import { Die100 } from '../../constants/dies.ts';
import { DEFENSE_LUCK_EFFECTS } from '../../constants/game.ts';
import { setPlayerFirstTurnId } from '../../game.ts';
import { applyDefenseLuck, getDefenseLuckConstant } from '../../helpers/luck.ts';

jest.mock('../../constants/dies.ts', () => ({
  Die100: {
    roll: jest.fn(),
  },
}));

jest.mock('../../helpers/game.ts', () => ({
  noDamageReceived: jest.fn(),
}));

jest.mock('../../game', () => ({
  setPlayerFirstTurnId: jest.fn(),
  idPlayerFirstTurn: null
}));


describe('applyDefenseLuck function', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpia los mocks antes de cada test
  });

  it('should return the correct constant for the luckRoll', () => {
    const luckConstant = getDefenseLuckConstant(89);
    expect(luckConstant).toBe(DEFENSE_LUCK_EFFECTS.START_NEXT_ROUND);
  });

  it('should call modify the damageReceived to 0 and return the correct string', () => {
    (Die100.roll as jest.Mock).mockReturnValue(15); 
    const res = applyDefenseLuck(2,playerMock);
    expect(res.dealedDamage).toBe(0);
    expect(res.luckMessage).toEqual('The attack has been dodged');
    
  });

  it('should call nextRoundStartFirst when defenseLuck is START_NEXT_ROUND', () => {
    (Die100.roll as jest.Mock).mockReturnValue(98); 
    const res = applyDefenseLuck(1,playerMock);
    expect(setPlayerFirstTurnId).toHaveBeenCalled();
    expect(res.luckMessage).toEqual('The player will start first in the next round');
    
  });

  it('should do nothing when defenseLuck is NO_EFFECTS', () => {
    (Die100.roll as jest.Mock).mockReturnValue(34); 
    const res = applyDefenseLuck(3,playerMock);
    expect(setPlayerFirstTurnId).not.toHaveBeenCalled();
    expect(res.luckMessage).toEqual('The luck roll has no effect');
  });
});
