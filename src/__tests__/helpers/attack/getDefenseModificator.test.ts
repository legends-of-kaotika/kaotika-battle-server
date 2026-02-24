import { getDefenseModificator } from "../../../helpers/attack"
import { weapon } from "../../../__mocks__/attack/weapon.ts";


describe('getDefenseModificator', () => {
  describe('cases where minDamageChance is 100', () => {
    const minDamageChance100 = [
      { attack: 100, weaponRoll: 120, defense: 600 },
      { attack: 100, weaponRoll: 120, defense: 500 },
      { attack: 100, weaponRoll: 120, defense: 400 },
      { attack: 100, weaponRoll: 120, defense: 300 },
      { attack: 100, weaponRoll: 120, defense: 200 },
      { attack: 100, weaponRoll: 120, defense: 100 },
      { attack: 100, weaponRoll: 120, defense: 1 },
      { attack: 100, weaponRoll: 60, defense: 600 },
      { attack: 100, weaponRoll: 60, defense: 500 },
      { attack: 100, weaponRoll: 60, defense: 400 },
      { attack: 100, weaponRoll: 60, defense: 300 },
      { attack: 100, weaponRoll: 60, defense: 200 },
      { attack: 100, weaponRoll: 60, defense: 100 },
      { attack: 100, weaponRoll: 60, defense: 1 },
      { attack: 30, weaponRoll: 60, defense: 600 },
      { attack: 30, weaponRoll: 60, defense: 500 },
      { attack: 30, weaponRoll: 60, defense: 400 },
      { attack: 30, weaponRoll: 60, defense: 300 },
      { attack: 30, weaponRoll: 60, defense: 200 },
      { attack: 30, weaponRoll: 60, defense: 100 },
      { attack: 30, weaponRoll: 60, defense: 1 },
      { attack: 20, weaponRoll: 30, defense: 400 },
      { attack: 20, weaponRoll: 30, defense: 300 },
      { attack: 20, weaponRoll: 30, defense: 200 },
      { attack: 20, weaponRoll: 30, defense: 100 },
      { attack: 20, weaponRoll: 30, defense: 1 },
      { attack: 10, weaponRoll: 15, defense: 200 },
      { attack: 10, weaponRoll: 15, defense: 100 },
      { attack: 10, weaponRoll: 15, defense: 1 },
      { attack: 1, weaponRoll: 1, defense: 1 },

    ];
    for (let i = 0; i < minDamageChance100.length; i++) {
      const weaponRoll = minDamageChance100[i].weaponRoll;
      const defense = minDamageChance100[i].defense;
      const attackAttribute = minDamageChance100[1].attack;

      describe(`case of damage ${weaponRoll + attackAttribute} and defense ${defense}`, () => {
        it('mult should not be null', () => {
          const mult = getDefenseModificator(defense, weaponRoll, attackAttribute, weapon);
          expect(mult).not.toBeNull();
        })
      })
    }
  });

  describe('cases where minDamageChance is 50,', () => {
    describe('cases where weaponRoll is >=50% of weaponMaxRoll', () => {
      const minDamageChance50 = [
        { attack: 1, weaponRoll: 34, defense: 500 },
        { attack: 1, weaponRoll: 24, defense: 400 },
        { attack: 1, weaponRoll: 14, defense: 300 },
      ]

      for (let i = 0; i < minDamageChance50.length; i++) {
        const defense = minDamageChance50[i].defense;
        const weaponRoll = minDamageChance50[i].weaponRoll;
        const attackAttribute = minDamageChance50[i].attack;


        it("mult should not be null", () => {
          const mult = getDefenseModificator(defense, weaponRoll, attackAttribute, weapon);

          expect(mult).not.toBeNull();
        })
      }
    });
    describe('cases where weaponRoll is <50% of weaponMaxRoll', () => {
      const minDamageChance50 = [

        { attack: 32, weaponRoll: 1, defense: 500 },
        { attack: 32, weaponRoll: 1, defense: 400 },
        { attack: 32, weaponRoll: 1, defense: 300 },
      ]

      for (let i = 0; i < minDamageChance50.length; i++) {
        const defense = minDamageChance50[i].defense;
        const weaponRoll = minDamageChance50[i].weaponRoll;
        const attackAttribute = minDamageChance50[i].attack;

        it("mult should be null", () => {
          const mult = getDefenseModificator(defense, weaponRoll, attackAttribute, weapon);
          expect(mult).toBeNull();
        })
      }
    })
  })
  describe('cases where minDamageChance is 30,', () => {
    describe('cases where weaponRoll is >=30% of weaponMaxRoll', () => {
      const minDamageChance30 = [
        { attack: 20, weaponRoll: 34, defense: 500 },
        { attack: 20, weaponRoll: 24, defense: 500 },
      ]

      for (let i = 0; i < minDamageChance30.length; i++) {
        const defense = minDamageChance30[i].defense;
        const weaponRoll = minDamageChance30[i].weaponRoll;
        const attackAttribute = minDamageChance30[i].attack;


        it("mult should not be null", () => {
          const mult = getDefenseModificator(defense, weaponRoll, attackAttribute, weapon);

          expect(mult).not.toBeNull();
        })
      }
    });
    describe('cases where weaponRoll is <30% of weaponMaxRoll', () => {
      const minDamageChance30 = [
        { attack: 32, weaponRoll: 6, defense: 600 },
        { attack: 32, weaponRoll: 6, defense: 500 },
      ]

      for (let i = 0; i < minDamageChance30.length; i++) {
        const defense = minDamageChance30[i].defense;
        const weaponRoll = minDamageChance30[i].weaponRoll;
        const attackAttribute = minDamageChance30[i].attack;

        it("mult should be null", () => {
          const mult = getDefenseModificator(defense, weaponRoll, attackAttribute, weapon);
          expect(mult).toBeNull();
        })
      }
    })
  })
  describe('cases where minDamageChance is 0', () => {
    const minDamageChance0 = [
      { attack: 5, weaponRoll: 5, defense: 600 },
      { attack: 1, weaponRoll: 1, defense: 600 },
      { attack: 1, weaponRoll: 1, defense: 500 },
      { attack: 1, weaponRoll: 1, defense: 400 },
      { attack: 1, weaponRoll: 1, defense: 300 },
      { attack: 1, weaponRoll: 1, defense: 200 },
      { attack: 1, weaponRoll: 1, defense: 600 },
    ];
    for (let i = 0; i < minDamageChance0.length; i++) {
      const weaponRoll = minDamageChance0[i].weaponRoll;
      const defense = minDamageChance0[i].defense;
      const attackAttribute = minDamageChance0[1].attack;

      describe(`case of damage ${weaponRoll + attackAttribute} and defense ${defense}`, () => {
        it('mult should be null', () => {
          const mult = getDefenseModificator(defense, weaponRoll, attackAttribute, weapon);
          expect(mult).toBeNull();
        })
      })
    }
  });

})