import { FUMBLE_MESSAGE } from '../constants/messages.ts';
import { FumbleDamage, Fumble } from '../interfaces/Fumble.ts';
import { Attribute } from '../interfaces/Attribute.ts';
import { FUMBLE_EFFECTS } from '../constants/game.ts';
import { EFFECTS_FUMBLE } from '../constants/combatRules.ts';
import { Player } from '../interfaces/Player.ts';

export type FumbleType = 'slash'| 'fairytale' | 'hack' | 'smash';

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
export const getSlashDamage = (calculationFumbleDamage: number): Partial<Attribute> => {
  const slashResult = Math.ceil(calculationFumbleDamage / 2);
  return {hit_points: slashResult};
};

//add erudite glasses to player
export const getFairytaleDamage = (): Partial<Player> => {
  return {eruditoGlasses: true};
};

//halve the dex of currentPlayer forever
export const getHackDamage = (currentPlayerDex: number): Partial<Attribute> => {
  const hackResult = Math.ceil(currentPlayerDex / 2);
  return {dexterity: hackResult};
};

export const getFumbleObject = (percentileFumble: number, typeFumble: FumbleType, damageFumble: FumbleDamage): Fumble => {
  return {percentile: percentileFumble, message: FUMBLE_MESSAGE[typeFumble],type: typeFumble, damage: damageFumble};
};

export const getFumble = (fumbleEffect: FumbleType, currentPlayerAttributes: Attribute, weaponDieRoll: number, percentile: number) => {
  const calculationFumbleDamage = getCalculationFumbleDamage(currentPlayerAttributes.BCFA, weaponDieRoll);
  switch (fumbleEffect) {
  case FUMBLE_EFFECTS.SLASH: {
    const slashDamage = getSlashDamage(calculationFumbleDamage);
    return getFumbleObject(percentile, fumbleEffect, slashDamage); 
  }
  case FUMBLE_EFFECTS.FAIRYTALE: { //change later on 
    const calculationFumbleDamage = getCalculationFumbleDamage(currentPlayerAttributes.BCFA, weaponDieRoll);
    const slashDamage = getSlashDamage(calculationFumbleDamage);
    return getFumbleObject(percentile, FUMBLE_EFFECTS.SLASH, slashDamage);
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
    return undefined;
  }
};

//--------------------------------------------------------------------------------//