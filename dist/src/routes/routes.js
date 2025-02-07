import express from 'express';
import { initFetchPlayerController } from '../controllers/playerController.ts';
const router = express.Router();
export default router;
router.get('/:email', (req, res) => {
    initFetchPlayerController(req, res);
});
