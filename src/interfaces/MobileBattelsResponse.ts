import { Battle } from './Battles.ts';

export type MobileBattelsResponse =
  | { status: 'OK'; battles: Battle[] }
  | { status: 'FAILED'; error: string };