import { Player } from '../db/models/index.ts';
import type { PlayerPopulated } from '../interfaces/PlayerPopulated.ts';

const EQUIPMENT_PATHS = ['armor', 'weapon', 'artifact', 'ring', 'helmet', 'shield', 'boot'] as const;
const INVENTORY_PATHS = ['helmets', 'shields', 'weapons', 'boots', 'rings', 'armors', 'artifacts'] as const;

/* eslint-disable @typescript-eslint/no-explicit-any */
const populatePaths = async (doc: any, paths: readonly string[]): Promise<void> => {
  await Promise.all(paths.map((path) => doc.populate(path, { profiles: 0 })));
};

export const getPlayerByEmail = async (email: string): Promise<PlayerPopulated | null> => {
  const found = await Player.findOne({ email }).exec();
  if (!found) return null;

  const populated: any = await Player.findById(found._id).populate('profile').exec();
  if (!populated) return null;

  await populatePaths(populated.equipment, EQUIPMENT_PATHS);
  await populatePaths(populated.inventory, INVENTORY_PATHS);

  const ingredientIds: unknown[] = [...(populated.inventory.ingredients ?? [])];
  const counts = new Map<string, number>();
  for (const raw of ingredientIds) {
    const id = String(raw);
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }

  await populated.inventory.populate('ingredients', { profiles: 0 });
  const ingredients: any[] = populated.inventory.ingredients ?? [];

  const plain = populated.toObject();
  plain.inventory.ingredients = [...counts.entries()].map(([id, qty]) => {
    const object = ingredients.find((ingredient) => String(ingredient._id) === id);
    if (!object) return { _id: id, qty };
    const base = typeof object.toObject === 'function' ? object.toObject() : object;
    return { ...base, qty };
  });

  return plain as PlayerPopulated;
};
