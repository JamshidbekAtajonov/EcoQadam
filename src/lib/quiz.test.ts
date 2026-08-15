import { describe, expect, it } from "vitest";
import { demoChallenges, demoLessons, demoQuestions, demoTrees } from "@/data/demo";
import { findFollowUpQuestion, initialAdaptiveQueue, scoreAttempt } from "@/lib/quiz";

describe("adaptive quiz", () => {
  it("ships the requested demo curriculum counts", () => {
    expect(demoLessons).toHaveLength(6);
    expect(demoQuestions).toHaveLength(30);
    expect(demoChallenges).toHaveLength(4);
    expect(demoTrees).toHaveLength(20);
  });
  it("starts with two questions from every topic", () => {
    const queue = initialAdaptiveQueue(demoQuestions);
    expect(queue).toHaveLength(10);
    expect(new Set(queue.map((question) => question.topic))).toEqual(new Set(["WATER", "DROUGHT", "TREE_CARE", "WASTE", "AIR"]));
  });

  it("adds an unused follow-up from a weak topic", () => {
    const used = new Set(demoQuestions.filter((question) => question.topic === "DROUGHT").slice(0, 2).map((question) => question.id));
    const followUp = findFollowUpQuestion(demoQuestions, "DROUGHT", used);
    expect(followUp?.topic).toBe("DROUGHT");
    expect(used.has(followUp?.id ?? "")).toBe(false);
  });

  it("reports score and weakest topics", () => {
    const result = scoreAttempt([
      { questionId: "1", selectedIndex: 0, correct: true, topic: "WATER" },
      { questionId: "2", selectedIndex: 1, correct: false, topic: "AIR" },
      { questionId: "3", selectedIndex: 2, correct: false, topic: "AIR" },
    ]);
    expect(result).toMatchObject({ score: 33, correctCount: 1, incorrectCount: 2, weakTopics: ["AIR"] });
  });
});
