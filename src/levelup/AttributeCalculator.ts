import { ATTRIBUTES_INCREASE_PER_LEVEL, LevelUpAttributes } from './configs/levelConfig.ts';
import { ProfilesAttributes, type ProfilesEntry } from './configs/profilesConfig.ts';
import { Roll } from './Roll.ts';
import type { LevelUpAttributes as Attrs } from './types.ts';

type MutableAttribute = 'intelligence' | 'dexterity' | 'charisma' | 'constitution' | 'strength';

const ATTRIBUTE_FIELD: Record<number, MutableAttribute> = {
  [LevelUpAttributes.INTELLIGENCE]: 'intelligence',
  [LevelUpAttributes.DEXTERITY]: 'dexterity',
  [LevelUpAttributes.CHARISMA]: 'charisma',
  [LevelUpAttributes.CONSTITUTION]: 'constitution',
  [LevelUpAttributes.STRENGTH]: 'strength',
};

const ATTRIBUTE_NAME_INDEX: Record<string, number> = {
  Intelligence: LevelUpAttributes.INTELLIGENCE,
  Dexterity: LevelUpAttributes.DEXTERITY,
  Charisma: LevelUpAttributes.CHARISMA,
  Constitution: LevelUpAttributes.CONSTITUTION,
  Strength: LevelUpAttributes.STRENGTH,
};

const WEIGHT_TOTALS = { major: 40, minor: 24, normal: 36 };

const assignAttributeChance = (weights: number[], names: string[], percent: number): void => {
  for (const name of names) {
    const index = ATTRIBUTE_NAME_INDEX[name];
    if (index === undefined) throw new Error(`Attribute not valid: ${name}`);
    weights[index] = percent;
  }
};

export const assignChanceToAttributes = (majorAttributes: string[],
  minorAttributes: string[],
  normalAttributes: string[],): number[] => {
  const weights: number[] = new Array(LevelUpAttributes.TOTAL);
  assignAttributeChance(weights, majorAttributes, Math.ceil(WEIGHT_TOTALS.major / majorAttributes.length));
  assignAttributeChance(weights, minorAttributes, Math.ceil(WEIGHT_TOTALS.minor / minorAttributes.length));
  assignAttributeChance(weights, normalAttributes, Math.ceil(WEIGHT_TOTALS.normal / normalAttributes.length));
  return weights;
};

const accumulateChances = (chances: number[]): number[] =>
  chances.map((_, index) =>
    chances.slice(0, index + 1).reduce((accumulator, current) => accumulator + current, 0),);

export const calculateAttributesForOneRoll = (roll: number,
  chances: number[],
  attributes: Attrs,): Attrs => {
  const validChances = chances.filter((chance) => roll <= chance);
  const attributeChance = Math.min(...validChances);
  const attributeId = chances.indexOf(attributeChance);
  const field = ATTRIBUTE_FIELD[attributeId];
  if (field === undefined) throw new Error('Attribute not valid');
  return { ...attributes, [field]: attributes[field] + 1 };
};

const computeAttributes = (profile: ProfilesEntry,
  attributes: Attrs,
  iterations: number,): Attrs => {
  const chances = accumulateChances(assignChanceToAttributes(profile.major_attributes, profile.minor_attributes, profile.normal_attributes),);
  let current = { ...attributes };
  for (let i = 0; i < iterations; ++i) {
    current = calculateAttributesForOneRoll(new Roll(100, 1, 0).execute(), chances, current);
  }
  return current;
};

export const updateAttributesForProfileName = (profileName: string,
  attributes: Attrs,
  iterations: number = ATTRIBUTES_INCREASE_PER_LEVEL,): Attrs => {
  const profile = ProfilesAttributes.find((entry) => entry.name === profileName);
  if (!profile) throw new Error(`Profile not found: ${profileName}`);
  return computeAttributes(profile, attributes, iterations);
};
