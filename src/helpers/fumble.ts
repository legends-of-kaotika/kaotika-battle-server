import { Player } from '../interfaces/Player.ts';



export const getFumblePercentage = (playerCFP: number, successPercentage: number) => {
  return Math.floor(100 -(100 - successPercentage) * playerCFP /100);
};

//----------------------helper for getting fumble effect------------------------------//

export const getCalculationFumbleDamage = (bcfa: number , weaponDieRoll: number ): number => {
  return Math.ceil((bcfa + weaponDieRoll) / 5);
};

export const getCalculationFumblePercentile = (fumblePercentage: number, die100Roll: number): number => {
  return Math.ceil(100 * (die100Roll - fumblePercentage) / (100 - fumblePercentage));
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
  return Math.ceil(calculationFumbleDamage / 2); //console.log to explain what happens?
}; //object with hit point and to who me (later do merge)

export const applyFairytale = (currentPlayer: Player): number => {
  currentPlayer.eruditoGlasses = true; ///add in interface eruditoGlasses?
  return 0; //object hitPoint 0 but message yes ???
};

//halve the dex of currentPlayer forever
export const applyHack = (currentPlayerDex: number)=> {
  return Math.ceil(currentPlayerDex / 2);
}; //object with dex and to who me (later do merge)

//kill the current player
export const applyScythe = (currentPlayerHitPoints: number)=> {
  return currentPlayerHitPoints + 1;
}; // object hit points and to who me (later do merge)

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