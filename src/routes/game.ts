import express, { Request, Response } from 'express';
import { getMissions } from '../controllers/game.ts';

const router: express.Router = express.Router();
export default router;

router.get('/missions', (req: Request, res: Response) => {
  getMissions(req, res);
});
