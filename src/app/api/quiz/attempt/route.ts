import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

const attemptSchema = z.object({
  quizSlug: z.string(),
  score: z.number().int().min(0).max(100),
  correctCount: z.number().int().nonnegative(),
  incorrectCount: z.number().int().nonnegative(),
  weakTopics: z.array(z.string()),
  answers: z.array(z.object({ questionId: z.string(), selectedIndex: z.number().int(), correct: z.boolean(), topic: z.string() })),
  syncId: z.string().optional(),
});

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 });
  const parsed = attemptSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ message: "Invalid attempt" }, { status: 400 });

  const quiz = await prisma.quiz.findUnique({ where: { slug: parsed.data.quizSlug } });
  if (!quiz) return Response.json({ message: "Quiz not found" }, { status: 404 });

  const recommendation = parsed.data.weakTopics[0]
    ? { topic: parsed.data.weakTopics[0], message: "Recommended lesson for your weakest topic" }
    : { message: "Ready for the next lesson" };

  const data = {
      userId: user.id,
      quizId: quiz.id,
      score: parsed.data.score,
      correctCount: parsed.data.correctCount,
      incorrectCount: parsed.data.incorrectCount,
      answers: parsed.data.answers,
      weakTopics: parsed.data.weakTopics,
      recommendation,
      syncId: parsed.data.syncId,
    };
  const attempt = parsed.data.syncId
    ? await prisma.quizAttempt.upsert({ where: { syncId: parsed.data.syncId }, create: data, update: {} })
    : await prisma.quizAttempt.create({ data });
  return Response.json({ attempt, recommendation }, { status: 201 });
}
