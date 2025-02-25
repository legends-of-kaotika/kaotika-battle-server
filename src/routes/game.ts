import express, { Request, Response } from 'express';
import { getBattles } from '../controllers/game.ts';

const router: express.Router = express.Router();
export default router;

router.get('/battles', (req: Request, res: Response) => {
  getBattles(req, res);
});
