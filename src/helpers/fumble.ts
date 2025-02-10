

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