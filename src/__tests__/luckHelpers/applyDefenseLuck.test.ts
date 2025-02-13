import { playerMock } from '../../__mocks__/players.ts';
import { Die100 } from '../../constants/dies.ts';
import { DEFENSE_LUCK_EFFECTS } from '../../constants/game.ts';
import { noDamageReceived } from '../../helpers/game.ts';
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

  it('should call noDamageReceived when defenseLuck is NO_DAMAGE_RECEIVED', () => {
    (Die100.roll as jest.Mock).mockReturnValue(15); 
    applyDefenseLuck(playerMock);
    expect(noDamageReceived).toHaveBeenCalled();
  });

  it('should call nextRoundStartFirst when defenseLuck is START_NEXT_ROUND', () => {
    (Die100.roll as jest.Mock).mockReturnValue(98); 
    applyDefenseLuck(playerMock);
    expect(setPlayerFirstTurnId).toHaveBeenCalled();
  });

  it('should do nothing when defenseLuck is NO_EFFECTS', () => {
    (Die100.roll as jest.Mock).mockReturnValue(34); 
    applyDefenseLuck(playerMock);
    expect(noDamageReceived).not.toHaveBeenCalled();
    expect(setPlayerFirstTurnId).not.toHaveBeenCalled();
  });
});
