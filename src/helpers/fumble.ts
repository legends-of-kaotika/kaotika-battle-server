import { FUMBLE_MESSAGE } from '../constants/messages.ts';
import { FumbleDamage, Fumble } from '../interfaces/Fumble.ts';
import { Attribute } from '../interfaces/Attribute.ts';
import { FUMBLE_EFFECTS } from '../constants/game.ts';
import { EFFECTS_FUMBLE } from '../constants/combatRules.ts';

export type FumbleType = 'slash' | 'lightsmash' | 'hack' | 'smash';

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
export const getSlashDamage = (calculationFumbleDamage: number): Partial<Attribute> => {
  const slashResult = Math.ceil(calculationFumbleDamage / 3);
  return {hit_points: slashResult};
};

//add erudite glasses to player
export const getSmashDamage = (calculationFumbleDamage: number): Partial<Attribute> => {
  const slashResult = Math.ceil(calculationFumbleDamage / 2);
  return {hit_points: slashResult};
};

//halve the dex of currentPlayer forever
export const getHackDamage = (currentPlayerDex: number): Partial<Attribute> => {
  const hackResult = Math.ceil(currentPlayerDex / 2);
  return {dexterity: hackResult};
};

export const getFumbleObject = (percentileFumble: number, typeFumble: FumbleType, damageFumble: FumbleDamage): Fumble => {
  return {percentile: percentileFumble, message: FUMBLE_MESSAGE[typeFumble], type: typeFumble, damage: damageFumble};
};

export const getFumble = (fumbleEffect: FumbleType, currentPlayerAttributes: Attribute, weaponDieRoll: number, percentile: number) : Fumble | null => {
  const calculationFumbleDamage = getCalculationFumbleDamage(currentPlayerAttributes.BCFA, weaponDieRoll);
  switch (fumbleEffect) {
  case FUMBLE_EFFECTS.SLASH: {
    const slashDamage = getSlashDamage(calculationFumbleDamage);
    return getFumbleObject(percentile, fumbleEffect, slashDamage); 
  }
  case FUMBLE_EFFECTS.LIGHTSMASH: { //change later on 
    const calculationFumbleDamage = getCalculationFumbleDamage(currentPlayerAttributes.BCFA, weaponDieRoll);
    const slashDamage = getSmashDamage(calculationFumbleDamage);
    return getFumbleObject(percentile, fumbleEffect, slashDamage);
  }
  case FUMBLE_EFFECTS.HACK: {
    const hackDamage = getHackDamage(currentPlayerAttributes.dexterity);
    return getFumbleObject(percentile, fumbleEffect, hackDamage); 
  }
  case FUMBLE_EFFECTS.SMASH: {
    const smashDamage = {hit_points: calculationFumbleDamage};
    return getFumbleObject(percentile, fumbleEffect, smashDamage); 
  }
  default:
    console.log('Unknown fumble effect');
    return null;
  }
};

//--------------------------------------------------------------------------------//