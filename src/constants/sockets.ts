
// ROOMS
export const MOBILE = 'mobile';

// ---- EMITS ---- //

export const CONNECTED_USERS = 'connectedUsers';
export const WEB_SET_SELECTED_PLAYER = 'web-setSelectedPlayer';
export const WEB_SELECT_HEAL = 'web-selectHeal';
export const WEB_SELECT_CURSE = 'web-selectCurse';
export const WEB_SELECT_USE_POTION = 'web-selectUsePotion';
export const WEB_SEND_USER = 'web-sendUser';
export const WEB_USER_DISCONNECT = 'web-playerDisconnected';
export const SEND_TIMER = 'send-timer';
export const TURN_START = 'turn-start';
export const ASSIGN_TURN = 'assign-turn';
export const GAME_START = 'gameStart';
export const UPDATE_PLAYER = 'updatePlayer';
export const REMOVE_PLAYER = 'removePlayer';
export const GAME_END = 'gameEnd';
export const NOT_ENOUGH_PLAYERS = 'mobile-insufficientPlayers';
export const KILLED_PLAYER = 'send-killedPlayer';
export const WEB_CURRENT_ROUND = 'web-currentRound';
export const ATTACK_INFORMATION = 'web-attackInformation';
export const GAME_RESET = 'gameReset';
export const WEB_TURN_TIMEOUT = 'web-turnTimeout';

// ---- LISTENERS ---- //

// Mobile

export const MOBILE_SEND_SOCKET_ID = 'mobile-sendSocketId';
export const MOBILE_GAME_START = 'mobile-gameStart';
export const MOBILE_SET_SELECTED_PLAYER = 'mobile-setSelectedPlayer';
export const MOBILE_SELECT_HEAL = 'mobile-selectHeal';
export const MOBILE_SELECT_CURSE = 'mobile-selectCurse';
export const MOBILE_SELECT_USE_POTION = 'mobile-selectUsePotion';
export const MOBILE_ATTACK = 'mobile-attack';
export const MOBILE_RESET_GAME = 'mobile-gameReset';


// Web

export const WEB_SEND_USERS = 'web-sendUsers';
export const DISCONNECT = 'disconnect';
export const WEB_SEND_SOCKET_ID = 'web-sendSocketId';
export const WEB_TURN_END = 'web-turnEnd';
export const WEB_ATTACK_ANIMATION_END = 'web-attackAnimationEnd';
export const WEB_STOP_TIMER = 'web-stopTimer';

