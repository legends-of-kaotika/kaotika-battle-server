import { Socket } from 'socket.io';
import * as SOCKETS from '../../../constants/sockets.ts';
import {
  BATTLES,
  CONNECTED_USERS,
  GAME_USERS,
  isGameCreated,
  isGameStarted,
  resetInitialGameValues,
  round,
  setGameStarted,
  setIsGameCreated,
  setSelectedBattleId,
  setTarget,
  target,
  webSocketId,
} from '../../../game.ts';
import { MobileSignInResponse } from '../../../interfaces/MobileSignInRespose.ts';
import { MobileBattlesResponse } from '../../../interfaces/MobileBattlesResponse.ts';

import { fetchBattles } from '../../../helpers/api.ts';
import { findBattleById, parseWebBattleData } from '../../../helpers/battle.ts';
import { attackFlow, changeTurn, checkStartGameRequirement } from '../../../helpers/game.ts';
import { addBattleNPCsToGame } from '../../../helpers/npc.ts';
import {
  findConnectedPlayerById,
  findPlayerById,
  isPlayerConnected
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
import { MobileJoinBattleResponse } from '../../../interfaces/MobileJoinBattleResponse.ts';
import { sendCreatedBattleToWeb, sendSelectedBattleToWeb, sendIsGameCreated, sendIsGameCreatedToEmiter } from '../../emits/game.ts';
import { turnTime } from '../../../timer/timer.ts';

export const mobileUserHandlers = (socket: Socket): void => {

  // Mobile login.

  socket.on(SOCKETS.MOBILE_SIGN_IN, async (email: string, callback: (_response: MobileSignInResponse) => void) => {

    console.log(`New player logged in: ${email}`);

    if (!callback) {
      console.log(`No callback function received in socket ${SOCKETS.MOBILE_SIGN_IN}.`);
      return;
    }

    if (!email) {
      console.log(`No email received in ${SOCKETS.MOBILE_SIGN_IN} socket! Player login cancelled.`);
      callback({status: 'FAILED', error: `No email received in ${SOCKETS.MOBILE_SIGN_IN} socket! Player login cancelled.`});
      return;
    }

    const playerData = await getPlayerDataByEmail(email);

    if (!playerData) {
      console.log(`No player found for email ${email}. Player login cancelled.`);
      callback({status: 'FAILED', error: `No player found for email ${email}. Player login cancelled.`});
      return;
    }

    if (isPlayerConnected(playerData._id)) {
      console.log('Player already logged in.');
      callback({status: 'FAILED', error: 'Player already logged in.'});
      return;
    }

    playerData.socketId = socket.id;
    CONNECTED_USERS.push(playerData);
    console.log(`${playerData.nickname} inserted into CONNECTED_USERS`);

    socket.join(SOCKETS.MOBILE); // Enter to mobile socket room 
    
    // Send data to mobile.
    callback({status: 'OK', player: playerData});

  });

  // When Mortimer presses the START Button
  socket.on(SOCKETS.MOBILE_GAME_START, async () => {

    console.log(`Socket ${SOCKETS.MOBILE_GAME_START} received`);

    // Check if there at least 1 acolyte no betrayer connected (enemy always there is one as a bot)
    if (!checkStartGameRequirement()) {
      console.log('Not minimum 1 acolyte no betrayer connected, can\'t start game');
      sendNotEnoughPlayers(socket.id);
    } else {
      console.log('mobile-gameStart socket message listened. Sending Online users to everyone.');
    
      // Set game as started
      setGameStarted(true);
    
      // Sort players by successes, charisma, dexterity
      const playersTurnSuccesses = getPlayersTurnSuccesses(GAME_USERS);
      sortTurnPlayers(playersTurnSuccesses, GAME_USERS);
      changeTurn();
      sendConnectedUsersArrayToAll(GAME_USERS);
      gameStartToAll();
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
    sendSelectedPlayerIdToWeb(target);
  });

  // When a player selects that is going to heal
  socket.on(SOCKETS.MOBILE_SELECT_HEAL, async () => {
    console.log(`${SOCKETS.MOBILE_SELECT_HEAL} socket message listened. Performing heal.`);
    sendHealSelectedToWeb();
  });

  // When a player selects that is going to curse
  socket.on(SOCKETS.MOBILE_SELECT_CURSE, async () => {
    console.log(`${SOCKETS.MOBILE_SELECT_CURSE} socket message listened. Performing curse.`);
    sendCurseSelectedToWeb();
  });

  // When a player selects that is going to use a potion
  socket.on(SOCKETS.MOBILE_SELECT_USE_POTION, async () => {
    console.log(`${SOCKETS.MOBILE_SELECT_USE_POTION} socket message listened. Using potion.`);
    sendUsePotionSelectedToWeb();
  });

  socket.on(SOCKETS.MOBILE_ATTACK, async (_id: string) => {

    console.log(`${SOCKETS.MOBILE_ATTACK} socket message listened.`);

    if (turnTime<=1) {
      console.log('The attack wont be executed as the timer is 1 or lesser.');
      return;
    }

    attackFlow(_id);
    
  });

  socket.on(SOCKETS.MOBILE_CREATE_GAME, async (_id: string) => {

    console.log(`${SOCKETS.MOBILE_CREATE_GAME} socket message listened.`);
        
    if (!_id) {
      console.log(`No battle ID received in socket ${SOCKETS.MOBILE_CREATE_GAME}`);
    }

    const battleData = findBattleById(_id);
    
    if (!battleData) {
      console.error(`Battle with id ${_id} not found`);
      return;
    }
    
    // Set the selected battle.
    setSelectedBattleId(_id);

    // Add the NPCs from the battle to game users array.
    addBattleNPCsToGame(battleData.enemies);
    
    // Set the lobby created to true.
    setIsGameCreated(true);
    
    // Send data to clients.
    const webBattleData = parseWebBattleData(battleData);

    // Send the data to clients.
    sendCreatedBattleToWeb(webBattleData);
    sendIsGameCreated();

  });

  socket.on(SOCKETS.MOBILE_GET_BATTLES, async ( callback: (_response: MobileBattlesResponse) => void) => {
    console.log(`${SOCKETS.MOBILE_GET_BATTLES} socket message listened.`);

    if (!callback) {
      console.log(`No callback function received in socket ${SOCKETS.MOBILE_GET_BATTLES}.`);
      return;
    }

    try {
      
      const battles = await fetchBattles();

      BATTLES.length = 0;
      BATTLES.push(...battles);

      console.log({ status: 'OK', battles: battles });

      // Send data to mobile.
      callback({ status: 'OK', battles: battles }); 
    } catch (error) {
      console.error('Error fetching battles:', error);
      callback({ status: 'FAILED', error: 'Error fetching battles' });
    }
  });

  socket.on(SOCKETS.MOBILE_RESET_GAME, () => {
    resetInitialGameValues();
    logUnlessTesting(`listen the ${SOCKETS.MOBILE_RESET_GAME} to all`);
    io.emit(SOCKETS.GAME_RESET, () => {
      logUnlessTesting(`sending the emit ${SOCKETS.GAME_RESET}`);
    });
  });
  
  socket.on(SOCKETS.MOBILE_SELECTED_BATTLE, async (_id: string) => {
    console.log(`${SOCKETS.MOBILE_SELECTED_BATTLE} socket message listened.`);
    setSelectedBattleId(_id);
    sendSelectedBattleToWeb();
  });

  socket.on(SOCKETS.MOBILE_IS_GAME_CREATED, () => {
    logUnlessTesting(`listen the ${SOCKETS.MOBILE_IS_GAME_CREATED}.`);
    sendIsGameCreatedToEmiter(socket.id);
  });

  
  socket.on(SOCKETS.MOBILE_JOIN_BATTLE, (playerId: string, callback: (_response: MobileJoinBattleResponse) => void) => {
    
    console.log(`${socket.id} trying to join the battle`);
    
    if (!callback) {
      console.log(`No callback function received in socket ${SOCKETS.MOBILE_JOIN_BATTLE}.`);
      return;
    }

    if (!isGameCreated) {
      callback({status: 'OK', joinBattle: false});
      return;
    }

    if (isGameStarted) {
      callback({status: 'OK', joinBattle: false});
      return;
    }

    if (!playerId) {
      console.log(`No playerId received in ${SOCKETS.MOBILE_JOIN_BATTLE} socket! Player join to battle cancelled.`);
      callback({status: 'FAILED', error: 'No playerId received.'});
      return;
    }
    
    const player = findConnectedPlayerById(playerId);

    if (!player){
      console.log(`No player found with id ${playerId} in ${SOCKETS.MOBILE_JOIN_BATTLE} socket! Player join to battle cancelled.`);
      callback({status: 'FAILED', error: `No player found with id ${playerId}.`});
      return;
    }
    const user_copy = JSON.parse(JSON.stringify(player));
    
    GAME_USERS.push(user_copy);
    sendUserDataToWeb(player);

    // Send data to mobile.
    callback({status: 'OK', joinBattle: true});

    // Send data to web
    io.to(webSocketId).emit(SOCKETS.WEB_JOINED_BATTLE, playerId);
  });

  socket.on(SOCKETS.MOBILE_IS_GAME_STARTED, async() => {
    logUnlessTesting(`listen the ${SOCKETS.MOBILE_IS_GAME_STARTED}.`);
    io.to(socket.id).emit(SOCKETS.IS_GAME_STARTED, isGameStarted);
  });
};