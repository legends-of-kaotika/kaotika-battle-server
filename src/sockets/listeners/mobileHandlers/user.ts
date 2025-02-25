import { Server, Socket } from 'socket.io';
import * as SOCKETS from '../../../constants/sockets.ts';
import {
  isGameCreated,
  ONLINE_USERS,
  resetInitialGameValues,
  round,
  setGameStarted,
  setTarget,
  target,
} from '../../../game.ts';

import { attackFlow, changeTurn, checkStartGameRequirement } from '../../../helpers/game.ts';
import {
  findPlayerById
} from '../../../helpers/player.ts';
import { insertSocketId } from '../../../helpers/socket.ts';
import { getPlayersTurnSuccesses, sortTurnPlayers } from '../../../helpers/turn.ts';
import { logUnlessTesting } from '../../../helpers/utils.ts';
import {
  gameStartToAll,
  sendConnectedUsersArrayToAll,
  sendCreateBattleToWeb,
  sendCurseSelectedToWeb,
  sendHealSelectedToWeb,
  sendNotEnoughPlayers,
  sendSelectedPlayerIdToWeb,
  sendUsePotionSelectedToWeb,
  sendUserDataToWeb,
} from '../../emits/user.ts';
import { findBattleById } from '../../../helpers/battle.ts';

export const mobileUserHandlers = (io: Server, socket: Socket): void => {
  sendResetGame(socket, io);
  listenMobileIsGameCreated(socket, io);

  // Receive socketId + email from clientMobile
  socket.on(SOCKETS.MOBILE_SEND_SOCKET_ID, async (email: string) => {
    console.log(`new player with socketId: ${socket.id} ${email}`);
    const newPlayerConnected = insertSocketId(email, socket.id);
    if (newPlayerConnected) {
      socket.join(SOCKETS.MOBILE); // Enter to mobile socket room 
      sendUserDataToWeb(io, newPlayerConnected);
    }
  });

  // When Mortimer presses the START Button
  socket.on(SOCKETS.MOBILE_GAME_START, async () => {

    console.log(`Socket ${SOCKETS.MOBILE_GAME_START} received`);

    // Check if there at least 1 acolyte no betrayer connected (enemy always there is one as a bot)
    if (checkStartGameRequirement() === false) {
      console.log('Not minimum 1 acolyte no betrayer connected, can\'t start game');
      sendNotEnoughPlayers(io, socket.id);
    } else {
      console.log('mobile-gameStart socket message listened. Sending Online users to everyone.');
    
      // Set game as started
      setGameStarted(true);
    
      // Sort players by successes, charisma, dexterity
      const playersTurnSuccesses = getPlayersTurnSuccesses(ONLINE_USERS);
      sortTurnPlayers(playersTurnSuccesses, ONLINE_USERS);
      changeTurn();
      sendConnectedUsersArrayToAll(io, ONLINE_USERS);
      gameStartToAll(io);
      // Assign the first player
      console.log('Round: ', round);
    }
  });

  // When the current turn player selects a player
  socket.on(SOCKETS.MOBILE_SET_SELECTED_PLAYER, async (_id: string) => {
    
    console.log(`Socket ${SOCKETS.MOBILE_SET_SELECTED_PLAYER} received`);
    
    const newTarget = findPlayerById(_id);
    console.log('newTarget: ', newTarget?.nickname);
    
    if (!newTarget) {
      console.error('Selected player not found');
      return;
    }
  
    if (newTarget._id !== _id) {
      console.error('Target ID mismatch in selection');
      return;
    }
  
    setTarget(newTarget);
    sendSelectedPlayerIdToWeb(io, target);
  });

  // When a player selects that is going to heal
  socket.on(SOCKETS.MOBILE_SELECT_HEAL, async () => {
    console.log(`${SOCKETS.MOBILE_SELECT_HEAL} socket message listened. Performing heal.`);
    sendHealSelectedToWeb(io);
  });

  // When a player selects that is going to curse
  socket.on(SOCKETS.MOBILE_SELECT_CURSE, async () => {
    console.log(`${SOCKETS.MOBILE_SELECT_CURSE} socket message listened. Performing curse.`);
    sendCurseSelectedToWeb(io);
  });

  // When a player selects that is going to use a potion
  socket.on(SOCKETS.MOBILE_SELECT_USE_POTION, async () => {
    console.log(`${SOCKETS.MOBILE_SELECT_USE_POTION} socket message listened. Using potion.`);
    sendUsePotionSelectedToWeb(io);
  });

  socket.on(SOCKETS.MOBILE_ATTACK, async (_id: string) => {

    console.log(`${SOCKETS.MOBILE_ATTACK} socket message listened.`);
    attackFlow(_id);
    
  });

  socket.on(SOCKETS.MOBILE_CREATE_GAME, async (_id: string) => {
    console.log(`${SOCKETS.MOBILE_CREATE_GAME} socket message listened.`);
    sendCreateBattleToWeb(findBattleById(_id), io);
  });



};

const sendResetGame = (socket : Socket, io: Server) : void => {
  socket.on(SOCKETS.MOBILE_RESET_GAME, () => {
    resetInitialGameValues();
    logUnlessTesting(`listen the ${SOCKETS.MOBILE_RESET_GAME} to all`);
    io.emit(SOCKETS.GAME_RESET, () => {
      logUnlessTesting(`sending the emit ${SOCKETS.GAME_RESET}`);
    });
  });
};



const listenMobileIsGameCreated = (socket : Socket, io: Server) : void => {
  socket.on(SOCKETS.MOBILE_IS_GAME_CREATED, () => {
    logUnlessTesting(`listen the ${SOCKETS.MOBILE_IS_GAME_CREATED} to all`);
    sendIsGameCreated(io);
  });
};

const sendIsGameCreated = (io: Server) : void => {
  logUnlessTesting(`emit the ${SOCKETS.IS_GAME_CREATED} to all with isGameStarted: ${isGameCreated}`);
  io.emit(SOCKETS.IS_GAME_CREATED, isGameCreated);
};