
import { battles } from '../__mocks__/battles.ts';
import { Player } from '../interfaces/Player.ts';
import { parsePlayerData } from './player.ts';
import { Battle } from '../interfaces/Battles.ts';

export const fetchBattles = async () : Promise<Battle[]> => {
  try {

    console.log('fetcBattles()');
    
    const request = await fetch(`${process.env.KAOTIKA_SERVER}/missions`);
    const battlesData = await request.json();

    if (battlesData.status !== 'OK') {
      throw new Error('Error fetching battles.');
    }
    
    if (!battlesData.data) {
      throw new Error('Error fetching battles.');
    }

    console.log('Returning battles');
    return battles;

  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getPlayerDataByEmail = async (email: string) : Promise<Player | null> => {
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

