import express, { Request, Response } from 'express';
import { controller } from '../controllers/game.ts';

const router: express.Router = express.Router();
export default router;

router.get('/', (req: Request, res: Response) => {
  controller(req, res);
});
