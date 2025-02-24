import { Request, Response } from 'express';

export const getMissions = async (req: Request, res: Response) => {

  try {
   
      

    return res
      .status(200)
      .send({});

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

