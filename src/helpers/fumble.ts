

//----------------------helper for getting fumble effect------------------------------//

export const getCalculationFumbleDamage = (bcfa: number , weaponDieRoll: number ): number => {
  return Math.ceil((bcfa + weaponDieRoll) / 5);
};

export const getCalculationFumblePercentile = (fumblePercentage: number, die100Roll: number): number => {
  return Math.ceil(100 * (die100Roll - fumblePercentage) / (100 - fumblePercentage));
};