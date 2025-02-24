import { missions } from '../__mocks__/missions.ts';

export const fetchMissions = async () => {
  try {
    console.log('fetchMissions()');
    const queryResponse = await fetch(`${process.env.KAOTIKA_SERVER}/}/`);
    const missionsData = await queryResponse.json();
    if (missionsData.status === 'NOT FOUND'){
      console.log('missions not found');
      return undefined;
    }
    console.log('Returning fake missions');
    return missions;
  } catch (error) {
    console.error(error);
    throw error;
  }
};