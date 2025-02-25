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