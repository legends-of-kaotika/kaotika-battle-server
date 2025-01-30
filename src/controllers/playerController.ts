import { Request, Response } from "express";
import { ONLINE_USERS } from "../game";
import { returnIfPlayerIsConnected } from "../helpers/helper";

import { initFetchPlayer } from "../services/playerService";
import { Player } from "../interfaces/Player";


export const initFetchPlayerController = async (req: Request, res: Response) => {

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
    const playerData : Player = await initFetchPlayer(email);
    if (!playerData) {
      return res.status(404).send({ message: "Does not exist any player with this email" });
    }
    // Return the player data
    if (returnIfPlayerIsConnected(playerData.email)) {
      console.log(playerData.email, 'is already connected');
      res.send({ status: "OK", data: playerData })
    } else {
      ONLINE_USERS.push(playerData)
      res.send({ status: "OK", data: playerData })
    }
    
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

