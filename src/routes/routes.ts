import { Request, Response } from "express";
const playerController = require("../controllers/playerController")

const express = require("express");
const router = express.Router();
module.exports = router;

router.get("/:email", playerController.initFetchPlayer );
