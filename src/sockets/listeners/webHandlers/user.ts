import { Socket } from 'socket.io';
import { WEB_ATTACK_ANIMATION_END, WEB_SEND_SOCKET_ID, WEB_SEND_USERS } from '../../../constants/sockets.ts';
import { ONLINE_USERS, setWebSocket, webSocketId } from '../../../game.ts';
import { changeTurn } from '../../../helpers/game.ts';
import { findPlayerById, findPlayerDeadId, handlePlayerDeath } from '../../../helpers/player.ts';
import { sleep } from '../../../helpers/utils.ts';
import { sendConnectedUsersArrayToWeb, sendUpdatedPlayerToMobile } from '../../emits/user.ts';
import { io } from '../../../../index.ts';

export const webUserHandlers = (socket: Socket): void => { 

  //gets web client socketId
  socket.on(WEB_SEND_SOCKET_ID, async () => {
    console.log('web-sendSocketId socket message listened. Getting web-client socket and saving it in webSocketId Variable.');
    setWebSocket(socket.id);
    console.log(webSocketId);
  });

  //sends current online players
  socket.on(WEB_SEND_USERS, async () => {
    console.log('web-sendUsers socket message listened. Sending Online Users to everyone.');
    sendConnectedUsersArrayToWeb(io, ONLINE_USERS);
  });


  // When attack animation ends, receives whose values changed in animation
  socket.on(WEB_ATTACK_ANIMATION_END, async (defenderId: string) => {

    console.log(`${WEB_ATTACK_ANIMATION_END} socket listened: web attack animation ended`);

    const updatedPlayer = findPlayerById(defenderId);
    if (updatedPlayer){
      const updatedPlayerAttributes = updatedPlayer.attributes;
      const updatedPlayerIsBetrayer = updatedPlayer.isBetrayer;

      // Send the updated player's attributes to mobile
      sendUpdatedPlayerToMobile(io, defenderId, updatedPlayerAttributes, updatedPlayerIsBetrayer);
    }
    
    // Death
    const deadPlayerId = findPlayerDeadId();
    if (deadPlayerId){
      handlePlayerDeath(deadPlayerId);
    }
    await sleep(2000);
    changeTurn();
  });

};

