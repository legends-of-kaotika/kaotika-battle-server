import { Server, Socket } from 'socket.io';
import { WEB_ATTACK_ANIMATION_END, WEB_SEND_SOCKET_ID, WEB_SEND_USERS, WEB_TURN_END, WEB_STOP_TIMER } from '../../../constants/sockets.ts';
import { ONLINE_USERS, setWebSocket, webSocketId } from '../../../game.ts';
import { changeTurn, eachSideHasPlayers } from '../../../helpers/game.ts';
import { findPlayerById, findPlayerDeadId, handlePlayerDeath } from '../../../helpers/player.ts';
import { sendConnectedUsersArrayToWeb, sendUpdatedPlayerToMobile } from '../../emits/user.ts';
import { clearTimer } from '../../../timer/timer.ts';

export const webUserHandlers = (io: Server, socket: Socket): void => { 

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

  // When the turn ends
  socket.on(WEB_TURN_END, async () => {
    console.log('web-turnEnd socket message listened. Check if the game has to end.');
 
    if (eachSideHasPlayers(io, ONLINE_USERS)) {
      console.log('Changing to the next turn.');
      changeTurn();
    }
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
  });

  socket.on(WEB_STOP_TIMER, () => {
    console.log(`${WEB_STOP_TIMER} socket listened. Stopping the timer`);
    clearTimer();
  });

};

