
import { Player } from '../interfaces/Player.ts';
import { parsePlayerData } from './player.ts';
import { Battle } from '../interfaces/Battles.ts';

export const fetchBattles = async () : Promise<Battle[]> => {
  try {

    console.log('fetchBattles()');
    
    const request = await fetch(`${process.env.KAOTIKA_SERVER}/missions`);
    const response = await request.json();

    if (response.status !== 'OK') {
      throw new Error('Error fetching battles.');
    }
    
    const battlesData = response.data;

    if (!battlesData || !Array.isArray(battlesData)) {
      throw new Error('Error fetching battles.');
    }

    return battlesData;

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

