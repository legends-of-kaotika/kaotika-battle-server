import { DividedPlayers } from './DividedPlayers.ts';
import { WebBattle } from './WebBattle.ts';

export interface WebSyncState {
  generation: number;
  gameCreated: boolean;
  gameStarted: boolean;
  selectedBattle: WebBattle | null;
  players: DividedPlayers;
  currentPlayerId: string | null;
  targetId: string | null;
  round: number;
  turnTime: number;
  attackPending: boolean;
}
