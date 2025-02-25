import { Request, Response } from 'express';
import { fetchBattles } from '../helpers/api.ts';
import { BATTLES } from '../game.ts';

export const getBattles = async (req: Request, res: Response) => {

  try {
   
    const battles = await fetchBattles();
    if (battles === null) {
      return res
        .status(404)
        .send({message: 'Not mission found'});
    }

    BATTLES.length = 0;
    BATTLES.push(...battles);

    return res
      .status(200)
      .send(battles);

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

