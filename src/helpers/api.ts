import { parsePlayerData } from './player.ts';
import { battles } from '../__mocks__/missions.ts';

export const fetchBattles = async () => {
  try {
    console.log('fetcBattles()');
    // const queryResponse = await fetch(`${process.env.KAOTIKA_SERVER}/}/`);
    // const missionsData = await queryResponse.json();
    // if (missionsData.status === 'NOT FOUND'){
    //   console.log('missions not found');
    //   return null;
    // }
    console.log('Returning fake battles');
    return battles;
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

