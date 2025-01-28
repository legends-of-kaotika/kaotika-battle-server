import { Server, Socket } from "socket.io";
import { sendConnectedUsersArray } from "../../emits/user";
import { ONLINE_USERS } from "../../../game";
import { findPlayerById, findPlayerBySocketId, insertSocketId, removePlayerConnected } from "../../../helpers/helper";

module.exports = (io: Server, socket: Socket) => {

  socket.on("mobile-userTest", async () => {
    socket.emit("mobile-userTest", 'User for mobile');
  });

  //////////////////////////////////////////////////
  //receive socketId + email from clientMobile
  socket.on("mobile-sendSocketId", async (email: string) => {
    console.log(`new player with socketId: ${socket.id} ${email}`);
    const newPlayerConnected = insertSocketId(email, socket.id);
    //send to web the new player connected
  })
  ///////////////////////////////////////////////////
  // //when player disconnects
  // socket.on("disconnect", async () => {
  //   console.log(`player with socketId ${socket.id} disconnected`);
  //   removePlayerConnected(socket.id);
  //   console.log("quitado victor: " + JSON.stringify(ONLINE_USERS));
  //   socket.broadcast.emit("playerDisconnected", {playerSocketId: socket.id});
  // })

  ////////////////////////////////////////////////////

  socket.on('mobile-gameStart', async () => {
    sendConnectedUsersArray(io)
  })

  socket.on('mobile-attack', async (data) => {
    const { _id } = data;
    let attacker = findPlayerById(_id);
    let defender = findPlayerBySocketId(socket.id);
    
    //calculate damage
    let totalDmg = 0;


    //return players to web
    sendConnectedUsersArray(io)
  })
  
}
