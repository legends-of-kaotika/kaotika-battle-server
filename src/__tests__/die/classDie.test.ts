import Die from '../../classes/Die.ts';

describe('Test Die class ant its methods', () => {
  describe('test creare, roll, rollWithModifier methods', () => {
    const die10 = Die.create(3, 3, 2);

    it('should creat the correct Die', () => {
      expect(die10).toBeInstanceOf(Die);
      expect(die10['num_faces']).toBe(3);
      expect(die10['num_die']).toBe(3);
      expect(die10['modifier']).toBe(2);
    });

    it('should return its max roll value when calling getMaxDieRoll method', () => {
      const maxDieRoll = die10.getMaxDieRoll();
      expect(maxDieRoll).toBe(11); //Max value of 3D3 + 2 should be 11
    })

    it('should roll the die correctly multiple times', () => {
      for (let i = 0; i < 100; i++) {
        const roll = die10.roll();
        expect(roll).toBeGreaterThanOrEqual(3); // Minimum possible roll (1 * num_die)
        expect(roll).toBeLessThanOrEqual(9); // Maximum possible roll (num_faces * num_die)
      }
    });

    it('should roll the die correctly with modifier multiple times', () => {
      for (let i = 0; i < 100; i++) {
        const rollWithModifier = die10.rollWithModifier();
        expect(rollWithModifier).toBeGreaterThanOrEqual(5); // Minimum possible roll + modifier
        expect(rollWithModifier).toBeLessThanOrEqual(11); // Maximum possible roll + modifier
      }
    });
  });
});