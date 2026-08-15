import type { DemoQuestion, LessonCategory } from "@/data/demo";

export type AnswerRecord = { questionId: string; selectedIndex: number; correct: boolean; topic: LessonCategory };

export function initialAdaptiveQueue(questions: DemoQuestion[], perTopic = 2) {
  const topics: LessonCategory[] = ["WATER", "DROUGHT", "TREE_CARE", "WASTE", "AIR"];
  return topics.flatMap((topic) => questions.filter((question) => question.topic === topic).slice(0, perTopic));
}

export function findFollowUpQuestion(
  questions: DemoQuestion[],
  topic: LessonCategory,
  usedIds: Set<string>,
) {
  return questions.find((question) => question.topic === topic && !usedIds.has(question.id));
}

export function scoreAttempt(answers: AnswerRecord[]) {
  const correctCount = answers.filter((answer) => answer.correct).length;
  const incorrectCount = answers.length - correctCount;
  const score = answers.length ? Math.round((correctCount / answers.length) * 100) : 0;
  const weakCounts = answers.reduce<Partial<Record<LessonCategory, number>>>((counts, answer) => {
    if (!answer.correct) counts[answer.topic] = (counts[answer.topic] ?? 0) + 1;
    return counts;
  }, {});
  const weakTopics = Object.entries(weakCounts)
    .sort(([, left], [, right]) => (right ?? 0) - (left ?? 0))
    .map(([topic]) => topic as LessonCategory);

  return { correctCount, incorrectCount, score, weakTopics };
}
