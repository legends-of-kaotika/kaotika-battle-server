import { missions } from '../__mocks__/missions.ts';
import { parsePlayerData } from './player.ts';

export const fetchMissions = async () => {
  try {
    console.log('fetchMissions()');
    // const queryResponse = await fetch(`${process.env.KAOTIKA_SERVER}/}/`);
    // const missionsData = await queryResponse.json();
    // if (missionsData.status === 'NOT FOUND'){
    //   console.log('missions not found');
    //   return null;
    // }
    console.log('Returning fake missions');
    return missions;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getPlayerDataByEmail = async (email: string) => {
  try {
    const queryResponse = await fetch(`${process.env.KAOTIKA_SERVER}/players/email/${email}/`);
    const userData = await queryResponse.json();
    if (userData.status === 'NOT FOUND'){
      console.log(`player with email: ${email} not found`);
      return null;
    }

    const user = parsePlayerData(userData.data);
    console.log('New User Created:');
    console.log('Email: ', email);
    console.log('Role: ', user.role);

    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

