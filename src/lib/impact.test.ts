import { describe, expect, it } from "vitest";
import { calculateChallengeImpact, calculateTreeSurvival, calculateWasteSorted, calculateWaterSaved } from "@/lib/impact";

describe("impact formulas", () => {
  it("calculates water saved from completed days", () => {
    expect(calculateWaterSaved(7)).toBe(105);
  });

  it("uses verified waste weight", () => {
    expect(calculateWasteSorted(10.4)).toBe(10.4);
  });

  it("calculates tree survival with one decimal precision", () => {
    expect(calculateTreeSurvival(18, 20)).toBe(90);
    expect(calculateTreeSurvival(0, 0)).toBe(0);
  });

  it("maps challenge categories to the correct metric", () => {
    expect(calculateChallengeImpact({ category: "TREE_CARE", completedDays: 30 })).toEqual({ type: "TREES_CARED", value: 1, unit: "tree" });
  });
});
