export interface Attribute {
  intelligence: number;
  dexterity: number;
  constitution: number;
  insanity: number;
  charisma: number;
  strength: number;
  hit_points: number; // (LEVEL * 5) + CON + (DEX / 3) - (INS / 2) + (INT / 3) + (CHA * 2) + (STR / 3)
  attack: number; //STR - INS / 2
  defense: number; //DEX + CON + INT/2
  magic_resistance: number; //INT + CHA
  CFP: number; //INS
  BCFA: number; //STR + INS
  resistance: number;
}