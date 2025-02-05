import { Server } from 'socket.io';
import { webSocketId } from '../../game';
import { Player } from '../../interfaces/Player';
import { ASSIGN_TURN, CONNECTED_USERS, GAME_START, REMOVE_PLAYER, SEND_TIMER, UPDATE_PLAYER, WEB_SELECT_CURSE, WEB_SELECT_HEAL, WEB_SELECT_USE_POTION, WEB_SEND_USER, WEB_SET_SELECTED_PLAYER, NOT_ENOUGH_PLAYERS, WEB_USER_DISCONNECT, GAME_END } from '../../constants/constants';
import { returnLoyalsAndBetrayers } from '../../helpers/helper';
import { DividedPlayers } from '../../interfaces/DividedPlayers';
import { Modifier } from '../../interfaces/Modifier';

//sends an array with the connected users to web client on user connection
export const sendConnectedUsersArrayToWeb = (io: Server, users: Player[]):void => {
  console.log('Emitting connectedUsers socket message with online user list to everyone.');
  const dividedPlayers: DividedPlayers = returnLoyalsAndBetrayers(users);
  io.to(webSocketId).emit(CONNECTED_USERS, dividedPlayers);
};

export const sendConnectedUsersArrayToAll = (io: Server, users: Player[]):void => {
  console.log('Emitting connectedUsers socket message with online user list to everyone.');
  const dividedPlayers: DividedPlayers = returnLoyalsAndBetrayers(users);    
  io.emit(CONNECTED_USERS, dividedPlayers);
};

// Sends tho the web that tha actual turn player has selected a player
export const sendSelectedPlayerIdToWeb = (io: Server, player: Player | undefined):void => {
  if (player) {
    io.to(webSocketId).emit(WEB_SET_SELECTED_PLAYER, player._id );
  }
};

// Sends tho the web that tha actual turn player selected to heal
export const sendHealSelectedToWeb = (io: Server):void => {
  io.to(webSocketId).emit(WEB_SELECT_HEAL);
};

// Sends tho the web that tha actual turn player selected to heal
export const sendCurseSelectedToWeb = (io: Server):void => {
  io.to(webSocketId).emit(WEB_SELECT_CURSE);
};

// Sends tho the web that tha actual turn player selected to use a potion
export const sendUsePotionSelectedToWeb = (io: Server):void => {
  io.to(webSocketId).emit(WEB_SELECT_USE_POTION);
};

// Sends the player data to server
export const sendUserDataToWeb = (io: Server, player:Player):void => {
  console.log(`Emitting web-sendUser socket message with ${player.name}'s player data to web.`);
  io.to(webSocketId).emit(WEB_SEND_USER, player);
};

// Sends the player data to server
export const sendTimerDataToAll = (io: Server, timer:number):void => {
  console.log(`Emitting send-timer socket message with turn time: ${timer} to all clients.`);
  io.emit(SEND_TIMER, timer);
};

// Sends the player data to server
export const assignTurn = (io: Server, player:Player):void => {
  console.log(`Assigned player:  ${player.name}`);
  console.log(`Emitting assign-turn socket message with ${player.name}'s player data to all devices to change turn.`);
  io.emit(ASSIGN_TURN, player._id);
};

export const gameStartToAll = (io: Server):void => {
  console.log('Emitting gameStart socket message to all devices.');
  io.emit(GAME_START);
};

// Sends the target players(id) with the attributes updated and the total damage
export const sendUpdatedPlayerToAll = (io: Server, id:string, updatedAttributes:Modifier, totalDamage:number, isBetrayer:boolean): void => {
  console.log(`Emitting updatePlayer socket message with ${id} id, the total damage and updated attributes`);
  io.emit(UPDATE_PLAYER, { _id: id, attributes: updatedAttributes, totalDamage: totalDamage, isBetrayer: isBetrayer});
};

// Sends the players(id) that has been disconnected
export const sendPlayerRemoved = (io: Server, player:Player): void => {
  console.log(`Emitting removePlayer socket message with ${player._id} id`);
  io.emit(REMOVE_PLAYER, player._id);
};

// Send that the game has end and a 'String with the name of the fraction winnner
export const sendGameEnd = (io: Server, winner:string) => {
  console.log(`Emitting gameEnd socket message to all devices, th battle result is ${winner}`);
  io.emit(GAME_END, winner);
};

// Send to Mortimer that there is not enough players
export const sendNotEnoughPlayers = (io: Server, socketId: string): void => {
  console.log('Emitting to Mortimer that there is not enough players to start the game');
  io.to(socketId).emit(NOT_ENOUGH_PLAYERS);
};

//Sends the name of the player that has been disconnected to web
export const sendPlayerDisconnectedToWeb = (io: Server, name: string): void => {
  console.log('Emitting to Web that ',name,' player has been disconnected from battle');
  io.to(webSocketId).emit(WEB_USER_DISCONNECT, name);
};