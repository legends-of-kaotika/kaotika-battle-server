import { io } from '../../../index.ts';
import * as SOCKETS from '../../constants/sockets.ts';
import { webSocketId } from '../../game.ts';
import { returnLoyalsAndBetrayers } from '../../helpers/game.ts';
import { logUnlessTesting } from '../../helpers/utils.ts';
import { AttackJson } from '../../interfaces/AttackJson.ts';
import { Attribute } from '../../interfaces/Attribute.ts';
import { DividedPlayers } from '../../interfaces/DividedPlayers.ts';
import { Player } from '../../interfaces/Player.ts';

//sends an array with the connected users to web client on user connection
export const sendConnectedUsersArrayToWeb = ( users: Player[] ): void => {
  logUnlessTesting(`Emitting ${SOCKETS.CONNECTED_USERS} socket message with online user list to everyone.`);
  const dividedPlayers: DividedPlayers = returnLoyalsAndBetrayers(users);
  io.to(webSocketId).emit(SOCKETS.CONNECTED_USERS, dividedPlayers);
};

export const sendConnectedUsersArrayToAll = ( users: Player[] ): void => {
  logUnlessTesting('Emitting connectedUsers socket message with online user list to everyone.');
  const dividedPlayers: DividedPlayers = returnLoyalsAndBetrayers(users);
  io.emit(SOCKETS.CONNECTED_USERS, dividedPlayers);
};

// Sends tho the web that tha actual turn player has selected a player
export const sendSelectedPlayerIdToWeb = ( player: Player | undefined): void => {
  if (player) {
    logUnlessTesting(`Emitting ${SOCKETS.WEB_SET_SELECTED_PLAYER} socket with player id.`);
    io.to(webSocketId).emit(SOCKETS.WEB_SET_SELECTED_PLAYER, player._id);
  }
};

// Sends tho the web that tha actual turn player selected to heal
export const sendHealSelectedToWeb = (): void => {
  logUnlessTesting(`Emitting ${SOCKETS.WEB_SELECT_HEAL} socket to web.`);
  io.to(webSocketId).emit(SOCKETS.WEB_SELECT_HEAL);
};

// Sends tho the web that tha actual turn player selected to heal
export const sendCurseSelectedToWeb = (): void => {
  logUnlessTesting(`Emitting ${SOCKETS.WEB_SELECT_CURSE} socket to web.`);
  io.to(webSocketId).emit(SOCKETS.WEB_SELECT_CURSE);
};

// Sends tho the web that tha actual turn player selected to use a potion
export const sendUsePotionSelectedToWeb = (): void => {
  logUnlessTesting(`Emitting ${SOCKETS.WEB_SELECT_USE_POTION} socket to web.`);
  io.to(webSocketId).emit(SOCKETS.WEB_SELECT_USE_POTION);
};

// Sends the player data to server
export const sendUserDataToWeb = (player: Player): void => {
  logUnlessTesting(`Emitting ${SOCKETS.WEB_SEND_USER} socket to web with ${player.name}'s player data.`);
  io.to(webSocketId).emit(SOCKETS.WEB_SEND_USER, player);
};

// Sends the player data to server
export const sendTimerDataToWeb = (timer: number): void => {
  logUnlessTesting(`Emitting ${SOCKETS.SEND_TIMER} socket message with turn time: ${timer} to web client`);
  io.to(webSocketId).emit(SOCKETS.SEND_TIMER, timer);
};

// Sends the player data to server
export const assignTurn = (player: Player): void => {
  logUnlessTesting(`Emitting ${SOCKETS.ASSIGN_TURN} socket message with ${player.name}'s id to all devices to change turn.`);
  io.emit(SOCKETS.ASSIGN_TURN, player._id);
};

export const gameStartToAll = (): void => {
  logUnlessTesting(`Emitting ${SOCKETS.GAME_START} socket message to all devices.`);
  io.emit(SOCKETS.GAME_START);
};

// Sends the target players(id) with the attributes updated and the total damage
export const sendAttackInformationToWeb = (attackJSON: AttackJson): void => {
  
  logUnlessTesting(`Emitting ${SOCKETS.ATTACK_INFORMATION} socket message, with attack information`);
  logUnlessTesting('----------------------- Attack Info ---------------------------');
  logUnlessTesting('Type: ' + attackJSON.attack.attackType);
  logUnlessTesting('Damage:');
  Object.entries(attackJSON?.attack?.dealedDamage ?? {}).forEach(([key, value]) => {
    logUnlessTesting(`  ${key}: ${value}`);
  });
  logUnlessTesting('DieRoll: ' + attackJSON.attack.dieRoll);
  logUnlessTesting('Critical Percentage: ' + attackJSON.attack.percentages.critical);
  logUnlessTesting('Failed Percentage: ' + attackJSON.attack.percentages.failed);
  logUnlessTesting('Fumble Percentage: ' + attackJSON.attack.percentages.fumble);
  logUnlessTesting('Normal Percentage: ' + attackJSON.attack.percentages.normal);
  logUnlessTesting('--------------------------------------------------------------');

  logUnlessTesting('\n------------------------ Luck Info ----------------------------');
  if (!attackJSON?.luck) {
    logUnlessTesting('The luck object does not exist');
  } else {

    if (!attackJSON?.luck.attacker){
      logUnlessTesting('The attacker doesnt have luck');
    } else {
      logUnlessTesting('Attacker Luck');
      Object.entries(attackJSON.luck.attacker).forEach(([key, value]) => {
        logUnlessTesting(`  ${key}: ${value}`);
      });
    }

    if (!attackJSON?.luck.defender){
      logUnlessTesting('The defender doesnt have luck');
    } else {
      Object.entries(attackJSON.luck.defender).forEach(([key, value]) => {
        logUnlessTesting(`  ${key}: ${value}`);
      });
    }

  }

  logUnlessTesting('---------------------------------------------------------------');
  
  io.to(webSocketId).emit(SOCKETS.ATTACK_INFORMATION, attackJSON);
};

// Sends the target players(id) with the attributes updated and the total damage to mobile
export const sendUpdatedPlayerToMobile = (id:string, updatedAttributes:Attribute, isBetrayer: boolean): void => {
  logUnlessTesting(`Emitting ${SOCKETS.UPDATE_PLAYER} socket message with ${id} id, the total damage, updated attributes and isBetrayer`);
  io.to(SOCKETS.MOBILE).emit(SOCKETS.UPDATE_PLAYER, { _id: id, attributes: updatedAttributes, isBetrayer: isBetrayer});
};

// Sends the players(id) that has been disconnected
export const sendPlayerRemoved = (playerId: string): void => {
  logUnlessTesting(`Emitting ${SOCKETS.REMOVE_PLAYER} socket message with ${playerId} id`);
  io.emit(SOCKETS.REMOVE_PLAYER, playerId);
};

// Send the game has ended and a string with the name of the winnner faction 
export const sendGameEnd = ( winner: string) => {
  logUnlessTesting(`Emitting ${SOCKETS.GAME_END} socket message to all devices, winner: ${winner}`);
  io.emit(SOCKETS.GAME_END, winner);
};

// Send to Mortimer that there is not enough players
export const sendNotEnoughPlayers = ( socketId: string): void => {
  logUnlessTesting(`Emitting ${SOCKETS.NOT_ENOUGH_PLAYERS} to socketId ${socketId} that there is not enough players to start the game`);
  io.to(socketId).emit(SOCKETS.NOT_ENOUGH_PLAYERS);
};

// Sends the name of the player that has been disconnected to web
export const sendPlayerDisconnectedToWeb = ( name: string): void => {
  logUnlessTesting(`Emitting ${SOCKETS.WEB_USER_DISCONNECT} to Web that ${name} player has been disconnected from battle`);
  io.to(webSocketId).emit(SOCKETS.WEB_USER_DISCONNECT, name);
};

// Sends the the id of the player that has been killed 
export const sendKilledPlayer = ( id: string): void => {
  logUnlessTesting(`Emitting to all connected devices that player with id: ${id} has been killed in the battle`);
  io.emit(SOCKETS.KILLED_PLAYER, id);
};
