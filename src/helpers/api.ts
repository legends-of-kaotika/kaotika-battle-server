import { getPlayerByEmail } from '../services/playerRetrievalService.ts';
import { getMissions } from '../services/missionService.ts';
import { Battle } from '../interfaces/Battles.ts';
import { Player } from '../interfaces/Player.ts';
import { parsePlayerData } from './player.ts';

export const fetchBattles = async (): Promise<Battle[]> => {
  try {
    const battles = await getMissions();
    if (!battles || !Array.isArray(battles) || battles.length === 0) {
      throw new Error('Error fetching battles.');
    }
    return battles;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getPlayerDataByEmail = async (email: string): Promise<Player | null> => {
  try {
    const populated = await getPlayerByEmail(email);
    if (!populated) {
      console.log(`player with email: ${email} not found`);
      return null;
    }

    const user = parsePlayerData(populated);
    console.log('New User Created:');
    console.log('Email: ', email);
    console.log('Role: ', user.role);
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
