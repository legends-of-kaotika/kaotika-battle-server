import { Weapon } from './Weapon.ts';
import { Helmet } from './Helmet.ts';
import { Armor } from './Armor.ts';
import { Boot } from './Boot.ts';
import { Shield } from './Shield.ts';
import { AntidotePotion } from './AntidotePotion.ts';
import { HealingPotion } from './HealingPotion.ts';
import { EnhancerPotion } from './EnhancerPotion.ts';

export interface Equipment {
  weapon: Weapon,
  helmet: Helmet,
  armor: Armor,
  boot: Boot,
  shield: Shield,
  healing_potion: HealingPotion,
  antidote_potion: AntidotePotion,
  enhancer_potion: EnhancerPotion,
}