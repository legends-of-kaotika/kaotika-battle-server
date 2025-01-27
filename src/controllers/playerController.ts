const playerService = require('../services/playerService');


const initFetchPlayer = async (req: { params: { email: string; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: { message?: string; status?: string; data?: { error: string; }; }): void; new(): any; }; }; send: (arg0: { status: string; data: any; }) => void; }) => {

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
    const playerData = await playerService.initFetchPlayer();
    if (!playerData) {
      return res.status(404).send({ message: "Does not exist any player with this email" });
    }
    // Return the player data 
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

