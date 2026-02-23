import { getFumblePercentage } from "../../../helpers/attack.ts";

describe("getFumblePercentage", () => {
  it("should return the correct Fumble percentage", () => {
    const result = getFumblePercentage(31, 20); // result 87.6
    expect(result).toBe(87);
  });

  it("should return the correct Fumble percentage", () => {
    const result = getFumblePercentage(80, 75); // Result 90
    expect(result).toBe(90);
  });

  it("should handle zero CFP correctly", () => {
    const result = getFumblePercentage(0, 20); // Result 100
    expect(result).toBe(100);
  });
});
