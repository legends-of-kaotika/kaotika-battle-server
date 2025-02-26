import { Battle } from './Battles.ts';

export type MobileBattlesResponse =
  | { status: 'OK'; battles: Battle[] }
  | { status: 'FAILED'; error: string };