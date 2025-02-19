import { playerMock } from '../../../__mocks__/players.ts';
import { getEquipmentDefense } from '../../../helpers/attack.ts';
import { Equipment } from '../../../interfaces/Equipment.ts';

describe('getEquipmentDefense', () => {
  it('calculates the total defense of the equipment correctly', () => {
    const equipmentMock: Equipment = playerMock.equipment;

    equipmentMock.helmet.defense = 2;
    equipmentMock.armor.defense = 10;
    equipmentMock.boot.defense = 1;
    equipmentMock.shield.defense = 4;

    const result = getEquipmentDefense(equipmentMock);

    expect(result).toBe(2 + 10 + 1 + 4);
  });

  it('returns 0 if all the items have 0 defense', () => {
    const equipmentMock: Equipment = playerMock.equipment;

    equipmentMock.helmet.defense = 0;
    equipmentMock.armor.defense = 0;
    equipmentMock.boot.defense = 0;
    equipmentMock.shield.defense = 0;

    const result = getEquipmentDefense(equipmentMock);

    expect(result).toBe(0);
  });

});
