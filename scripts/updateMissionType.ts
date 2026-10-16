import dotenv from 'dotenv';
import { connectDatabase, disconnectDatabase } from '../src/db/connection.ts';
import { Mission } from '../src/db/models/index.ts';

dotenv.config();

const VALID_TYPES = ['team', 'free-for-all'] as const;
type MissionType = typeof VALID_TYPES[number];

const missionId = process.env.MISSION_ID;
const missionName = process.env.MISSION_NAME;
const updateAll = process.env.ALL_MISSIONS === 'true';
const missionType = (process.env.MISSION_TYPE
  || (!missionId && !missionName && !updateAll ? 'team' : undefined)) as MissionType | undefined;

if (!missionType || !VALID_TYPES.includes(missionType)) {
  throw new Error(`MISSION_TYPE must be one of: ${VALID_TYPES.join(', ')}`);
}

const filter = missionId
  ? { _id: missionId }
  : missionName
    ? { name: missionName }
    : updateAll
      ? {}
      : { mission_type: { $exists: false } };

try {
  await connectDatabase();
  const result = await Mission.updateMany(filter, { $set: { mission_type: missionType } }).exec();
  console.log(`Updated ${result.modifiedCount} mission(s) to type ${missionType}.`);
} finally {
  await disconnectDatabase();
}
