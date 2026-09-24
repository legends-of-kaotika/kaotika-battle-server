import { pickRandom, selectAvailableEquipment } from '../EquipmentSelection.ts';
import type { EquipmentPiece } from '../types.ts';

const piece = (min_lvl: number): EquipmentPiece => ({
  _id: `id-${min_lvl}`,
  type: 'weapon',
  min_lvl,
  isUnique: false,
  isActive: true,
});

describe('EquipmentSelection', () => {
  it('should prefer normal band when not low-level roll', () => {
    const items = [piece(1), piece(5), piece(6), piece(20)];
    const available = selectAvailableEquipment(items, 5, false);
    expect(available.map((i) => i.min_lvl)).toEqual([5, 6]);
  });

  it('should fall back to low band when low-level roll', () => {
    const items = [piece(1), piece(2), piece(5)];
    const available = selectAvailableEquipment(items, 5, true);
    expect(available.map((i) => i.min_lvl)).toEqual([1, 2]);
  });

  it('should use low band when normal band is empty', () => {
    const items = [piece(1), piece(2)];
    const available = selectAvailableEquipment(items, 20, false);
    expect(available.map((i) => i.min_lvl)).toEqual([1, 2]);
  });

  it('pickRandom should return undefined for empty list', () => {
    expect(pickRandom([])).toBeUndefined();
  });

  it('pickRandom should return an element from the list', () => {
    const items = [piece(1), piece(2)];
    expect(items).toContain(pickRandom(items));
  });
});
