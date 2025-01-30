import express, { Request, Response } from "express";
import { initFetchPlayerController } from "../controllers/playerController";

const router: express.Router = express.Router();
export default router;

router.get("/:email", (req:Request, res:Response)=> {initFetchPlayerController(req, res)});
