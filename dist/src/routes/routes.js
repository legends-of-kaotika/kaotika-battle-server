"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const playerController = require("../controllers/playerController");
const express = require("express");
const router = express.Router();
module.exports = router;
router.get("/:email", playerController.initFetchPlayer);
