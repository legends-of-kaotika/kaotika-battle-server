
import { luckRolls } from '../../helpers/luck.ts';

const dieRollMock = jest.fn();

jest.mock('../../constants/dies', () => ({
  Die100: {
    roll: () => dieRollMock(),
  },
}));

describe('luckRolls', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return an empty array if charisma is less than 20', () => {
    expect(luckRolls(10)).toEqual([]);
    expect(luckRolls(0)).toEqual([]);
  });

  it('should roll once if charisma is 20', () => {
    dieRollMock.mockReturnValue(50);
    expect(luckRolls(20)).toHaveLength(1);
    expect(dieRollMock).toHaveBeenCalledTimes(1);
  });

  it('should roll twice if charisma is 45', () => {
    dieRollMock.mockReturnValue(50);
    expect(luckRolls(45)).toHaveLength(2);
    expect(dieRollMock).toHaveBeenCalledTimes(2);
  });

  it('should strop rolling if a roll is below 20', () => {
    dieRollMock.mockReturnValueOnce(25).mockReturnValueOnce(15);
    expect(luckRolls(60)).toHaveLength(2);
    expect(dieRollMock).toHaveBeenCalledTimes(2);
  });

  it('should roll the maximum times if no roll is below 20', () => {
    dieRollMock.mockReturnValue(50);
    expect(luckRolls(62)).toHaveLength(3);
    expect(dieRollMock).toHaveBeenCalledTimes(3);
  });


});