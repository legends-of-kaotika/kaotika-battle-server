import { Attribute } from "../../../interfaces/Attribute.ts";
import { calculateHitPoints } from "../../../helpers/player.ts";

describe("Attribute calculation functions", () => {
  describe("calculateHitPoints", () => {
    it("should calculate player's HP appropriately", () => {
      const attributes: Attribute = {
        constitution: 1,
        dexterity: 2,
        insanity: 10,
        intelligence: 5,
        charisma: 2,
        strength: 1,
        resistance: 100,
        attack: 0,
        hit_points: 0,
        defense: 0,
        magic_resistance: 0,
        CFP: 0,
        BCFA: 0,
      };
      const level = 1;

      const hp = calculateHitPoints(attributes, level);

      expect(hp).toBe(9);
    });
  });
});
