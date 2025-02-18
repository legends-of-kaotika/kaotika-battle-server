export interface Fumble {
    percentile: number,
    message: string,
    type: 'smash' | 'fairytale' | 'hack' | 'slash',
    damage: FumbleDamage
}
export interface FumbleDamage {
    hit_points?: number,
    dexterity?: number,
}