export interface Fumble {
    percentile: number,
    message: string,
    type: 'smash' | 'lightsmash' | 'hack' | 'slash',
    damage: FumbleDamage
}
export interface FumbleDamage {
    hit_points?: number,
    dexterity?: number,
}

export interface FumbleWeb {
    percentile: number,
    message: string,
    type: 'smash' | 'lightsmash' | 'hack' | 'slash',
    damage?: FumbleDamage
}