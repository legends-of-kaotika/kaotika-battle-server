export interface ItemData {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  type: string;
  value?: number;
  modifiers?: Record<string, number>;
  min_lvl?: number;
  isUnique?: boolean;
  isActive?: boolean;
}

export interface PlayerReward {
  playerId: string;
  playerName: string;
  playerAvatar: string;
  item?: ItemData;
}

export interface BattleRewards {
  gold: number;
  experience: number;
  playerRewards: PlayerReward[];
}

export interface FfaWinnerReward {
  playerId: string;
  playerName: string;
  playerAvatar: string;
  gold: number;
  experience: number;
  item?: ItemData;
  stolenItems: ItemData[];
}

export interface FfaLoserResult {
  playerId: string;
  playerName: string;
  playerAvatar: string;
  lostItem?: ItemData;
}

export interface FfaOutcome {
  winner: FfaWinnerReward;
  losers: FfaLoserResult[];
}

export interface BattleOutcome {
  winner: string;
  rewards: BattleRewards | null;
  ffa?: FfaOutcome;
}
