import { Socket } from 'socket.io';
import * as SOCKETS from '../../../constants/sockets.ts';
import {
  BATTLES,
  CONNECTED_USERS,
  GAME_USERS,
  resetInitialGameValues,
  round,
  setGameStarted,
  setTarget,
  target,
} from '../../../game.ts';

import { fetchBattles } from '../../../helpers/api.ts';
import { findBattleById } from '../../../helpers/battle.ts';
import { attackFlow, changeTurn, checkStartGameRequirement } from '../../../helpers/game.ts';
import { addBattleNPCsToGame } from '../../../helpers/npc.ts';
import {
  findPlayerById
} from '../../../helpers/player.ts';
import { getPlayersTurnSuccesses, sortTurnPlayers } from '../../../helpers/turn.ts';
import { logUnlessTesting } from '../../../helpers/utils.ts';
import {
  gameStartToAll,
  sendConnectedUsersArrayToAll,
  sendCurseSelectedToWeb,
  sendHealSelectedToWeb,
  sendNotEnoughPlayers,
  sendSelectedPlayerIdToWeb,
  sendUsePotionSelectedToWeb,
  sendUserDataToWeb,
} from '../../emits/user.ts';

import { io } from '../../../../index.ts';
import { getPlayerDataByEmail } from '../../../helpers/api.ts';
import { MobileSignInResponse } from '../../../interfaces/MobileSignInRespose.ts';
import { sendBattlestoMobile, sendCreateBattleToWeb, sendIsGameCreated } from '../../emits/game.ts';

  
export const mobileUserHandlers = (socket: Socket): void => {

  // Mobile login.

  socket.on(SOCKETS.MOBILE_SIGN_IN, async (email: string, callback: (_response: MobileSignInResponse) => void) => {

    console.log(`New player with socketId: ${socket.id} - ${email}`);

    if (!callback) {
      console.log(`No callback function received in socket ${SOCKETS.MOBILE_SIGN_IN}.`);
      return;
    }

    if (!email) {
      callback({status: 'FAILED', error: `No email received in ${SOCKETS.MOBILE_SIGN_IN} socket! Player login cancelled.`});
      return;
    }

    const playerData = await getPlayerDataByEmail(email);

    if (!playerData) {
      callback({status: 'FAILED', error: `No player found for email ${email}. Player login cancelled.`});
      return;
    }

    playerData.socketId = socket.id;
    CONNECTED_USERS.push(playerData);

    socket.join(SOCKETS.MOBILE); // Enter to mobile socket room 
    sendUserDataToWeb(io, playerData);
    
    // Send data to mobile.
    callback({status: 'OK', player: playerData});

  });

  // When Mortimer presses the START Button
  socket.on(SOCKETS.MOBILE_GAME_START, async () => {

    console.log(`Socket ${SOCKETS.MOBILE_GAME_START} received`);

    // Check if there at least 1 acolyte no betrayer connected (enemy always there is one as a bot)
    if (!checkStartGameRequirement()) {
      console.log('Not minimum 1 acolyte no betrayer connected, can\'t start game');
      sendNotEnoughPlayers(io, socket.id);
    } else {
      console.log('mobile-gameStart socket message listened. Sending Online users to everyone.');
    
      // Set game as started
      setGameStarted(true);
    
      // Sort players by successes, charisma, dexterity
      const playersTurnSuccesses = getPlayersTurnSuccesses(GAME_USERS);
      sortTurnPlayers(playersTurnSuccesses, GAME_USERS);
      changeTurn();
      sendConnectedUsersArrayToAll(io, GAME_USERS);
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
    sendCreateBattleToWeb(findBattleById(_id));
    const battle = findBattleById(_id);
    if (battle) {
      addBattleNPCsToGame(battle);
    } else {
      console.error(`Battle with id ${_id} not found`);
    }
  });

  socket.on(SOCKETS.MOBILE_GET_BATTLES, async () => {
    console.log(`${SOCKETS.MOBILE_GET_BATTLES} socket message listened.`);
    const battles = await fetchBattles();

    BATTLES.length = 0;
    BATTLES.push(...battles);

    sendBattlestoMobile(battles);
  });

  socket.on(SOCKETS.MOBILE_RESET_GAME, () => {
    resetInitialGameValues();
    logUnlessTesting(`listen the ${SOCKETS.MOBILE_RESET_GAME} to all`);
    io.emit(SOCKETS.GAME_RESET, () => {
      logUnlessTesting(`sending the emit ${SOCKETS.GAME_RESET}`);
    });
  });

  socket.on(SOCKETS.MOBILE_IS_GAME_CREATED, () => {
    logUnlessTesting(`listen the ${SOCKETS.MOBILE_IS_GAME_CREATED}.`);
    sendIsGameCreated();
  });

};