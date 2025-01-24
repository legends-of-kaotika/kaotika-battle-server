export interface Curse {
	_id: string;
	name: string;
	description: string;
	type: string;
	modifiers: {
		hit_points: number,
		intelligence: number,
		dexterity: number,
		constitution: number,
		insanity: number,
		charisma: number,
		strength: number
	}
}
