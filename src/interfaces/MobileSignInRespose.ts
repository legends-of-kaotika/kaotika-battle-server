import { Player } from './Player.ts';

export type MobileSignInResponse =
  | { status: 'OK'; player: Player }
  | { status: 'FAILED'; error: string };