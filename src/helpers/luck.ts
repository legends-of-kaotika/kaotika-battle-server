import { DEFENSE_LUCK_RULES } from '../constants/combatRules.ts';
import { Die100 } from '../constants/dies.ts';
import { DEFENSE_LUCK_EFFECTS } from '../constants/game.ts';
import { Player } from '../interfaces/Player.ts';
import { getValueFromRule } from './attack.ts';
import { nextRoundStartFirst, noDamageReceived } from './game.ts';

export const luckRolls = (charisma: number): number[] => {

  const rollTimes = Math.floor(charisma / 20);
  const luckRolls: number[] = [];

  for (let i = 0; i < rollTimes; i++) {
    const roll = Die100.roll();
    luckRolls.push(roll);
    if (roll < 20) {
      // If a throw is successful, the player is already lucky, so no further throws are needed.
      break;
    }
  }

  return luckRolls;
};

export const hasLuck = (luckRolls: number[]): boolean => {
  return luckRolls.some(roll => roll<20);
};

export const applyDefenseLuck = (defender: Player, playersTurn: Player[]) => {
  const roll = Die100.roll();
  const defenseLuck = getDefenseLuckConstant(roll);

  switch(defenseLuck){
  case DEFENSE_LUCK_EFFECTS.NO_DAMAGE_RECEIVED:
    noDamageReceived();
    // No damage receiverd func
    break;
  
  case DEFENSE_LUCK_EFFECTS.START_NEXT_ROUND:
    nextRoundStartFirst(defender, playersTurn);
    // defender start next round
    break;

  case DEFENSE_LUCK_EFFECTS.NO_EFFECTS:
    // void has no effects
    break;
  }
};

export const getDefenseLuckConstant = (luckRoll: number) : number => {
  return getValueFromRule(DEFENSE_LUCK_RULES, luckRoll);
};
export const attackerLuck = (attacker: Player) => {

  const attackerLuckRolls = luckRolls(attacker.attributes.charisma);
  const attackerHasLuck = hasLuck(attackerLuckRolls);
  
};