export type Attack = {
  attack: {
   targetPlayerId: string,
   hit_points: number,
   percentages: {
     critical: number,
     normal: number,
     failed: number,
     fumble: number
   },
   dieRoll: number,
   dealedDamage: number
 },
 luck: {
   attacker: {
     hasLuck: boolean,
     luckRolls: number[],
     luckRollMessage:string,
   },
   defender: {
     hasLuck: boolean,
     luckRolls:  number[],
     luckRollMessage: string,
   }
 }
};