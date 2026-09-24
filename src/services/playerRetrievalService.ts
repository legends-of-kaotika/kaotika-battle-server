import { Player } from '../db/models/index.ts';
import type { PlayerPopulated } from '../interfaces/PlayerPopulated.ts';

const EQUIPMENT_SLOTS = ['armor', 'weapon', 'artifact', 'ring', 'helmet', 'shield', 'boot'] as const;
const INVENTORY_SLOTS = ['helmets', 'shields', 'weapons', 'boots', 'rings', 'armors', 'artifacts'] as const;

const equipmentPaths = EQUIPMENT_SLOTS.map((slot) => `equipment.${slot}`);
const inventoryPaths = INVENTORY_SLOTS.map((slot) => `inventory.${slot}`);

export const getPlayerByEmail = async (email: string): Promise<PlayerPopulated | null> => {
  const found = await Player.findOne({ email }).exec();
  if (!found) return null;

  const populated = await Player.findById(found._id)
    .populate('profile')
    .populate(equipmentPaths)
    .populate(inventoryPaths)
    .exec();
  if (!populated) return null;

  const ingredientIds: unknown[] = [...(populated.inventory?.ingredients ?? [])];
  const counts = new Map<string, number>();
  for (const raw of ingredientIds) {
    const id = String(raw);
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }

  await populated.populate('inventory.ingredients');
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const ingredients: any[] = populated.inventory?.ingredients ?? [];

  const plain = populated.toObject() as any;
  plain.inventory.ingredients = [...counts.entries()].map(([id, qty]) => {
    const object = ingredients.find((ingredient) => ingredient != null && String(ingredient._id) === id);
    if (!object) return null;
    const base = typeof object.toObject === 'function' ? object.toObject() : object;
    return { ...base, qty };
  }).filter(Boolean);

  return plain as PlayerPopulated;
};
