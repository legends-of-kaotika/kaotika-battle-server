import { Player } from '../interfaces/Player.ts';
import { playerMock } from './players.ts';

export const turnPlayerMock : Player = { ...playerMock, _id: '12345'};

export const turnArray = [playerMock, playerMock];