import express, { Request, Response } from 'express';

const router: express.Router = express.Router();
export default router;

router.get('/', (req: Request, res: Response) => {
  console.log(req, res);
});
