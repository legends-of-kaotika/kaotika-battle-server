import dotenv from 'dotenv';
import { connectDatabase, disconnectDatabase } from '../src/db/connection.ts';
import { Mission } from '../src/db/models/index.ts';

dotenv.config();

const FFA_MISSION = {
  name: 'Free For All: Catedral',
  description: 'Acólitos contra acólitos. Solo queda en pie el más poderoso. Sin NPCs, sin equipos, todos contra todos.',
  enemies: [],
  allied: [],
  suggested_level: 10,
  drop_item_level: 12,
  gold: 10000,
  exp: 1750,
  battle_background: 'ashen_cathedral.webp',
  battle_music: 'battle.ogg',
  battle_video_background: '',
  battle_animations: [],
  end_of_battle_background: ['victory.webp', 'defeat.webp'],
  scene3d: 'legacy-cathedral' as const,
  mission_type: 'free-for-all' as const,
};

try {
  await connectDatabase();

  const existing = await Mission.findOne({ name: FFA_MISSION.name }).exec();
  if (existing) {
    console.log(`Mission "${FFA_MISSION.name}" already exists with _id: ${existing._id}`);
    console.log('Updating it to ensure mission_type is set...');
    await Mission.updateOne({ _id: existing._id }, { $set: FFA_MISSION }).exec();
    console.log('Updated.');
  } else {
    const created = await Mission.create(FFA_MISSION);
    console.log(`Created FFA mission "${FFA_MISSION.name}" with _id: ${created._id}`);
  }
} finally {
  await disconnectDatabase();
}
