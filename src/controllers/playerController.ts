import { Request, Response } from 'express';
import { isGameStarted, ONLINE_USERS } from '../game.ts';
import { isPlayerConnected } from '../helpers/player.ts';

import { initFetchPlayer } from '../services/playerService.ts';
import { Player } from '../interfaces/Player.ts';


export const initFetchPlayerController = async (req: Request, res: Response) => {

  const { params: { email } } = req;

  // Check if the parameter :email exist
  if (!email) {
    return res
      .status(400)
      .send({
        status: 'FAILED',
        data: { error: 'ERROR: Parameter :email cannot be empty' },
      });
  }

  // Check if game is already started
  if (isGameStarted) {
    return res
      .status(403)
      .send({
        status: 'FAILED',
        data: { error: 'Cannot join: Game is already in progress' },
      });
  }

  try {
    const playerData : Player = await initFetchPlayer(email);
    if (!playerData) {
      return res.status(404).send({ message: 'Does not exist any player with this email' });
    }
    // check if player is already connected
    if (isPlayerConnected(playerData.email)) {
      console.log(playerData.email, 'is already connected');
      return res.status(409).send({ message: 'User is already connected'});
    } else {
      ONLINE_USERS.push(playerData);
      // Return player data
      return res
        .status(200)
        .send({ status: 'OK', data: playerData });
    }
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({
        status: 'FAILED',
        message: 'ERROR while making the petition:',
        data: { error: error?.message || error }
      });
  }
};

