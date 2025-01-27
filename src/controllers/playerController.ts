import { Request, Response } from "express";
import { ONLINE_USERS } from "../game";

const playerService = require('../services/playerService');


const initFetchPlayer = async (req: Request, res: Response) => {

  const { params: { email } } = req;

  // Check if the parameter :email exist
  if (!email) {
    return res
      .status(400)
      .send({
        status: "FAILED",
        data: { error: "ERROR: Parameter :email cannot be empty" },
      });
  }

  try {
    const playerData = await playerService.initFetchPlayer(email);
    if (!playerData) {
      return res.status(404).send({ message: "Does not exist any player with this email" });
    }
    // Return the player data 
    ONLINE_USERS.push(playerData)
    res.send({ status: "OK", data: playerData })
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({
        status: "FAILED",
        message: "ERROR while making the petition:",
        data: { error: error?.message || error }
      });
  }
}


module.exports = {
  initFetchPlayer,
}

