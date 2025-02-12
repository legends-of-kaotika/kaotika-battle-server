import { Player } from '../interfaces/Player.ts';


////////////////// LUCK SE APLICA ????????????????????????????????


export const getFumblePercentage = (playerCFP: number, successPercentage: number) => {
  return Math.floor(100 -(100 - successPercentage) * playerCFP /100);
};

//----------------------helper for getting fumble effect------------------------------//

export const getCalculationFumbleDamage = (bcfa: number , weaponDieRoll: number ): number => {
  return Math.ceil((bcfa + weaponDieRoll) / 5);
};

export const getCalculationFumblePercentile = (fumblePercentage: number, attackRoll: number): number => {
  return Math.ceil(100 * (attackRoll - fumblePercentage) / (100 - fumblePercentage));
};

export const getFumbleEffect = (fumblePercentile: number ): string => {
  const effectsFumble = [
    {max: 30, effect: 'slash'},
    {max: 60, effect: 'fairytale'},
    {max: 80, effect: 'hack'},
    {max: Infinity, effect: 'scythe'}
  ];
  
  const {effect} = effectsFumble.find((element)=> (fumblePercentile <= element.max))!;
  return effect;
};

//-------------------------------------------------------------------------------------//

//----------------------helper for getting fumbleHitDamage-----------------------------//

//apply self damage to the player
export const applySlash = (calculationFumbleDamage: number): number => {
  return Math.ceil(calculationFumbleDamage / 2);
}; //damage hit point and idPlayer itself

export const applyFairytale = (currentPlayer: Player): number => {
  currentPlayer.eruditoGlasses = true; ///add in interface eruditoGlasses?
  return 0; //add attribute eruditoGlasses: true to currentPlayer
};

//halve the dex of currentPlayer forever
export const applyHack = (currentPlayerDex: number)=> {
  return Math.ceil(currentPlayerDex / 2);
}; //dex to half current player

//kill the current player
export const applyScythe = (currentPlayerHitPoints: number)=> {
  return currentPlayerHitPoints + 1;
}; // kill current player so damage is currentPlayer life + 1

export const getFumbleHitDamage = (fumbleEffect: string, currentPlayer: Player, calculationFumbleDamage: number) => {
  switch (fumbleEffect) {
  case 'slash':
    return applySlash(calculationFumbleDamage);
  case 'fairytale':
    return applyFairytale(currentPlayer);
  case 'hack':
    return applyHack(currentPlayer.attributes.dexterity);
  case 'scythe':
    return applyScythe(currentPlayer.attributes.hit_points);
  default:
    console.log('Unknown fumble effect');
    return 0;
  }
};

//--------------------------------------------------------------------------------//