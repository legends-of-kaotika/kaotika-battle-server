import { FUMBLE_MESSAGE } from '../constants/messages.ts';
import { Damage, Fumble } from '../interfaces/Fumble.ts';
import { Attribute } from '../interfaces/Attribute.ts';
import { FUMBLE_EFFECTS } from '../constants/game.ts';
import { EFFECTS_FUMBLE } from '../constants/combatRules.ts';

export type FumbleType = 'slash'| 'fairytale' | 'hack' | 'scythe';

export const getFumblePercentage = (playerCFP: number, successPercentage: number) => {
  return Math.floor((100 -(100 - successPercentage)) * playerCFP /100);
};

export const getCalculationFumbleDamage = (bcfa: number , weaponDieRoll: number ): number => {
  return Math.ceil((bcfa + weaponDieRoll) / 5);
};

//----------------------helper for getting fumble effect------------------------------//

export const getCalculationFumblePercentile = (fumblePercentage: number, attackRoll: number): number => {
  return Math.ceil(100 * (attackRoll - fumblePercentage) / (100 - fumblePercentage));
};

export const getFumbleEffect = (fumblePercentile: number ): FumbleType => {
  const {effect} = EFFECTS_FUMBLE.find((element)=> (fumblePercentile <= element.max))!;
  return effect;
};

//-------------------------------------------------------------------------------------//

//----------------------helper for getting fumble-----------------------------//

//apply self damage to the player
export const applySlashDamage = (calculationFumbleDamage: number): Record <string, number> => {
  const slashResult = Math.ceil(calculationFumbleDamage / 2);
  return {hit_points: slashResult};
};

//add erudite glasses to player
export const applyFairytaleDamage = (): Record <string, boolean> => {
  return {eruditoGlasses: true};
};

//halve the dex of currentPlayer forever
export const applyHackDamage = (currentPlayerDex: number): Record<string, number> => {
  const hackResult = Math.ceil(currentPlayerDex / 2);
  return {dexterity: hackResult};
};

//kill the current player
export const applyScytheDamage = (currentPlayerHitPoints: number): Record<string, number>=> {
  return {hit_points: currentPlayerHitPoints + 1};
};

export const getFumble = (percentileFumble: number, typeFumble: FumbleType, damageFumble: Damage): Fumble => {
  return {percentile: percentileFumble, message: FUMBLE_MESSAGE[typeFumble],type: typeFumble, damage: damageFumble};
};

export const applyFumble = (fumbleEffect: FumbleType, currentPlayerAttributes: Attribute, weaponDieRoll: number, percentile: number) => {
  switch (fumbleEffect) {
  case FUMBLE_EFFECTS.SLASH: {
    const calculationFumbleDamage = getCalculationFumbleDamage(currentPlayerAttributes.BCFA, weaponDieRoll);
    const slashDamage = applySlashDamage(calculationFumbleDamage);
    return getFumble(percentile, fumbleEffect, slashDamage); 
  }
  case FUMBLE_EFFECTS.FAIRYTALE: {
    return null;
  }
  case FUMBLE_EFFECTS.HACK: {
    const hackDamage = applyHackDamage(currentPlayerAttributes.dexterity);
    return getFumble(percentile, fumbleEffect, hackDamage); 
  }
  case FUMBLE_EFFECTS.SCYTHE: {
    const scytheDamage = applyScytheDamage(currentPlayerAttributes.hit_points);
    return getFumble(percentile, fumbleEffect, scytheDamage); 
  }
  default:
    console.log('Unknown fumble effect');
    return null;
  }
};

//--------------------------------------------------------------------------------//