import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Npc } from '../src/db/models/npc.ts';
import { Player } from '../src/db/models/player.ts';
import { NPC_MODELS, acolyteAssignments, assertKnown, masterModelByEmail } from '../src/helpers/model3d.ts';

dotenv.config();

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
    const assignments = acolyteAssignments(acolytes);

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
