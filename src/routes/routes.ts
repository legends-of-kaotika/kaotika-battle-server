import { Request, Response } from "express";

const express = require("express");
const router = express.Router();
module.exports = router;

router.get("/", (req:Request, res:Response)=>{res.send('Welcome')} );
