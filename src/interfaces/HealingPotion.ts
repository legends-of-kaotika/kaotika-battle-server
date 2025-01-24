export interface HealingPotion {
	_id: string,
	name: string,
	description: string,
	image: string,
	type: string,
	value: number,
	modifiers: {
		hit_points: number,
		intelligence: number,
		dexterity: number,
		constitution: number,
		insanity: number,
		charisma: number,
		strength: number
	},
	min_lvl: number
}