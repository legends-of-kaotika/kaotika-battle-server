import { Request, Response } from 'express';
import { fetchMissions } from '../helpers/api.ts';

export const getMissions = async (req: Request, res: Response) => {

  try {
   
    const missions = await fetchMissions();
    
    if (missions === null) {
      return res
        .status(404)
        .send({message: 'Not mission found'});
    }

    return res
      .status(200)
      .send(missions);

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

