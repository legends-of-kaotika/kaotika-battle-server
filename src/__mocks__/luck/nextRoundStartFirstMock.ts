import { Player } from '../../interfaces/Player.ts';
import { playerMock } from '../players.ts';

export const nextRoundStartFirstPlayer = {...playerMock};
export const nextRoundStartFirstPlayer2 : Player = {...playerMock, _id: '87263112398123'};
export const nextRoundStartFirstPlayer3 : Player = {...playerMock, _id: '8721231231112398123'};
export const nextRoundStartFirstMockPlayers : Player[] = [
  nextRoundStartFirstPlayer,
  nextRoundStartFirstPlayer2,
  nextRoundStartFirstPlayer3
];




