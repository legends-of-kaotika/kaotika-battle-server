import Die from '../classes/Die';

describe('Test Die class ant its methods', () => {
  describe('test creare, roll, rollWithModifier methos', () => {
    const die10 = Die.create(3, 3, 2);

    it('should creat the correct Die', () => {
      expect(die10).toBeInstanceOf(Die);
      expect(die10['num_faces']).toBe(3);
      expect(die10['num_die']).toBe(3);
      expect(die10['modifier']).toBe(2);
    });

    it('should roll the die correctly', () => {
      const roll = die10.roll();
      expect(roll).toBeGreaterThanOrEqual(2);
      expect(roll).toBeLessThanOrEqual(9);
    });

    it('should roll the die correctly with modifier', () => {
      const rollWithModifier = die10.rollWithModifier();
      expect(rollWithModifier).toBeGreaterThanOrEqual(5);
      expect(rollWithModifier).toBeLessThanOrEqual(11);
    });
  });
});