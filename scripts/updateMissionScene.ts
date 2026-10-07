import dotenv from 'dotenv';
import { connectDatabase, disconnectDatabase } from '../src/db/connection.ts';
import { Mission } from '../src/db/models/index.ts';

dotenv.config();

const VALID_SCENES = ['legacy-cathedral', 'dark-diorama'] as const;
type Scene3D = typeof VALID_SCENES[number];

const missionId = process.env.MISSION_ID;
const missionName = process.env.MISSION_NAME;
const updateAll = process.env.ALL_MISSIONS === 'true';
const scene = (process.env.SCENE3D
  || (!missionId && !missionName && !updateAll ? 'legacy-cathedral' : undefined)) as Scene3D | undefined;

if (!scene || !VALID_SCENES.includes(scene)) {
  throw new Error(`SCENE3D must be one of: ${VALID_SCENES.join(', ')}`);
}

const filter = missionId
  ? { _id: missionId }
  : missionName
    ? { name: missionName }
    : updateAll
      ? {}
      : { scene3d: { $exists: false } };

try {
  await connectDatabase();
  const result = await Mission.updateMany(filter, { $set: { scene3d: scene } }).exec();
  console.log(`Updated ${result.modifiedCount} mission(s) to scene ${scene}.`);
} finally {
  await disconnectDatabase();
}
