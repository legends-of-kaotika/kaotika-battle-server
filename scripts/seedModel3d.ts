import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Npc } from '../src/db/models/npc.ts';
import { Player } from '../src/db/models/player.ts';

dotenv.config();

/**
 * Every value must be a stem present in `public/assets/` of the web client.
 * The arena derives the animation set from MODEL_CLASS and the size from
 * MODEL_SCALE, so the value is a file name without extension.
 */
const KNOWN_MODELS = [
  'archer', 'arissa', 'brute', 'ch40', 'demon',
  'enemy-ganfaul', 'enemy-heraklios', 'enemy-knight', 'enemy-vampire',
  'eve', 'kachujin', 'maria', 'mutant', 'paladin',
] as const;

/** Big silhouettes for the L60+ crowd: mostly mages plus a couple of bruisers.
 *  The head of the list is what the smallest tier draws from, so it stays balanced. */
const POWERFUL_POOL = [
  'demon', 'enemy-vampire', 'brute',
  'enemy-heraklios', 'enemy-vampire',
  'enemy-knight', 'demon',
];

/** Human-sized models for the mid game. */
const MID_POOL = ['arissa', 'ch40', 'kachujin', 'arissa', 'ch40'];

/** Small human models for the weakest characters. */
const WEAK_POOL = ['archer', 'paladin', 'maria', 'eve', 'arissa', 'kachujin'];

const NPC_MODELS: Record<string, string> = {
  Dicerius: 'enemy-ganfaul',
  Demetrius: 'demon',
  Elias: 'enemy-knight',
  Lazarus: 'enemy-ganfaul',
  Nausea: 'enemy-vampire',
  Zachariah: 'mutant',
  Ascetum: 'enemy-heraklios',
  Banger: 'demon',
  Leoric: 'brute',
  Szar: 'enemy-knight',
  'Angelo di Mortis': 'ch40',
  Poluctus: 'enemy-vampire',
  Bishop: 'arissa',
  Strombo: 'kachujin',
  'PAZUS-DESPISTADUS': 'paladin',
  'Dr Github': 'archer',
  'The Calvorot Pringao': 'maria',
  'The Chinese': 'kachujin',
  Rous: 'eve',
  Angelo: 'arissa',
  'El Biuti': 'maria',
};

const hash = (value: string): number => {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
};

const masterModelByEmail = (): Record<string, string> => {
  const masters: Record<string, string> = {};
  if (process.env.ISTVAN_EMAIL) masters[process.env.ISTVAN_EMAIL] = 'brute';
  if (process.env.MORTIMER_EMAIL) masters[process.env.MORTIMER_EMAIL] = 'enemy-ganfaul';
  if (process.env.VILLAIN_EMAIL) masters[process.env.VILLAIN_EMAIL] = 'ch40';
  return masters;
};

const tierForLevel = (level: number): readonly string[] => (
  level >= 60 ? POWERFUL_POOL : level >= 20 ? MID_POOL : WEAK_POOL
);

const assertKnown = (model: string, where: string): void => {
  if (!(KNOWN_MODELS as readonly string[]).includes(model)) {
    throw new Error(`${where} points at unknown model "${model}"`);
  }
};

const apply = process.argv.includes('--apply');

const run = async (): Promise<void> => {
  const uri = process.env.MONGODB_ROUTE;
  if (!uri) throw new Error('MONGODB_ROUTE is not defined in the environment');
  await mongoose.connect(uri, { dbName: 'Kaotika' });

  try {
    const masters = masterModelByEmail();
    const changes: string[] = [];

    const npcs = await Npc.find({}).lean();
    for (const npc of npcs) {
      const label = npc.nickname || npc.name || String(npc._id);
      const model = NPC_MODELS[label];
      if (!model) throw new Error(`No model assigned to NPC "${label}"`);
      assertKnown(model, `NPC ${label}`);
      const current = (npc as { model3d?: string }).model3d ?? '';
      if (current !== model) {
        changes.push(`npc   ${label.padEnd(24)} ${(current || '—').padEnd(18)} -> ${model}`);
        if (apply) await Npc.updateOne({ _id: npc._id }, { $set: { model3d: model } });
      }
    }

    const players = await Player.find({}).lean();
    const acolytes = players.filter((player) => !masters[player.email]);
    const assignments = new Map<string, string>();

    // Spread every level tier over its pool: hash orders the queue, the index picks the model.
    const tiers = new Map<readonly string[], typeof acolytes>();
    for (const player of acolytes) {
      const tier = tierForLevel(player.level);
      tiers.set(tier, [...(tiers.get(tier) ?? []), player]);
    }
    for (const [tier, members] of tiers) {
      members
        .slice()
        .sort((left, right) => hash(String(left._id)) - hash(String(right._id)))
        .forEach((player, index) => assignments.set(String(player._id), tier[index % tier.length]));
    }

    for (const player of players) {
      const label = player.nickname || player.name || String(player._id);
      const model = masters[player.email] ?? assignments.get(String(player._id));
      if (!model) throw new Error(`No model assigned to player "${label}"`);
      assertKnown(model, `player ${label}`);
      const current = (player as { model3d?: string }).model3d ?? '';
      if (current !== model) {
        changes.push(`player ${label.padEnd(24)} ${(current || '—').padEnd(18)} -> ${model}`);
        if (apply) await Player.updateOne({ _id: player._id }, { $set: { model3d: model } });
      }
    }

    console.log(`${apply ? 'Applied' : 'Planned'} ${changes.length} changes across ${npcs.length} NPCs and ${players.length} players.`);
    for (const change of changes) console.log(`  ${change}`);
    if (!apply) console.log('\nDry run. Re-run with --apply to write.');
  } finally {
    await mongoose.disconnect();
  }
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
