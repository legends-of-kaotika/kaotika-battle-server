import { assignChanceToAttributes, updateAttributesForProfileName } from '../AttributeCalculator.ts';

const zeroAttrs = {
  intelligence: 1,
  dexterity: 1,
  insanity: 0,
  charisma: 1,
  constitution: 1,
  strength: 1,
};

describe('AttributeCalculator', () => {
  it('should assign major weight 40, minor 24 and normal 36', () => {
    const chances = assignChanceToAttributes(['Intelligence'], ['Constitution', 'Strength'], ['Dexterity', 'Charisma']);
    expect(chances[0]).toBe(40);
    expect(chances[3]).toBe(12);
    expect(chances[4]).toBe(12);
    expect(chances[1]).toBe(18);
    expect(chances[2]).toBe(18);
  });

  it('should increase exactly one mutable attribute per iteration and keep insanity', () => {
    const result = updateAttributesForProfileName('Scholar', zeroAttrs, 1);
    const increases =
      (result.intelligence - 1) +
      (result.dexterity - 1) +
      (result.charisma - 1) +
      (result.constitution - 1) +
      (result.strength - 1);
    expect(increases).toBe(1);
    expect(result.insanity).toBe(0);
  });

  it('should throw for unknown profile', () => {
    expect(() => updateAttributesForProfileName('Unknown', zeroAttrs)).toThrow('Profile not found');
  });
});
