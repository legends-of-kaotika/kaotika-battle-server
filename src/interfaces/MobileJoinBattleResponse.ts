export type MobileJoinBattleResponse =
  | { status: 'OK', joinBattle: boolean}
  | { status: 'FAILED', error: string};