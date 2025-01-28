export interface Modifier {
  intelligence: number;
  dexterity: number;
  constitution: number;
  insanity: number;
  charisma: number;
  strength: number;
  hit_points: number; //CON + DEX - INS/2
  attack: number; //STR - INS / 2
  defense: number; //DEX + CON + INT/2
  magic_resistance: number; //INT + CHA
  CFP: number; //INS
  BCFA: number; //STR + INS
  resistance: number;
}
