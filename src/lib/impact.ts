import { impactFormulas } from "@/config/impact";

export function calculateWaterSaved(completedDays: number) {
  return completedDays * impactFormulas.water.litersSavedPerCompletedDay;
}

export function calculateWasteSorted(reportedKilograms: number) {
  return reportedKilograms * impactFormulas.waste.kilogramsPerReportedKilogram;
}

export function calculateTreeSurvival(survived: number, monitored: number) {
  if (monitored === 0) return 0;
  return Math.round((survived / monitored) * 1000) / 10;
}

export function calculateChallengeImpact(input: {
  category: "WATER" | "WASTE" | "TREE_CARE" | "DROUGHT" | "AIR";
  completedDays: number;
  reportedValue?: number;
}) {
  if (input.category === "WATER") {
    return { type: "WATER_SAVED_LITERS" as const, value: calculateWaterSaved(input.completedDays), unit: "L" };
  }

  if (input.category === "WASTE") {
    return { type: "WASTE_SORTED_KG" as const, value: calculateWasteSorted(input.reportedValue ?? 0), unit: "kg" };
  }

  if (input.category === "TREE_CARE") {
    return {
      type: "TREES_CARED" as const,
      value: impactFormulas.trees.caredTreePerApprovedParticipation,
      unit: "tree",
    };
  }

  return { type: "TASKS_COMPLETED" as const, value: 1, unit: "task" };
}
