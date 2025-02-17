import { PotionModifier } from './PotionModifier.ts';

export interface Curse {
	_id: string;
	name: string;
	description: string;
	type: string;
	modifiers: PotionModifier
	antidote_effects: string[],
	poison_effects: string[],
}
