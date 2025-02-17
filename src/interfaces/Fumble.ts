export interface Fumble {
    percentile: number,
    message: string,
    type: 'slash' | 'fairytale' | 'hack' | 'scythe',
    damage: Damage
}
export interface Damage {
    hit_points?: number,
    dexterity?: number,
}