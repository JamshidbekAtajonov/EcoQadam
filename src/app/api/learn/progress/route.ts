import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

const progressSchema = z.object({ lessonSlug: z.string().min(1), percent: z.number().int().min(0).max(100) });

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 });
  const parsed = progressSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ message: "Invalid progress" }, { status: 400 });

  const lesson = await prisma.lesson.findUnique({ where: { slug: parsed.data.lessonSlug }, select: { id: true } });
  if (!lesson) return Response.json({ message: "Lesson not found" }, { status: 404 });

  const progress = await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId: lesson.id } },
    create: {
      userId: user.id,
      lessonId: lesson.id,
      percent: parsed.data.percent,
      status: parsed.data.percent === 100 ? "COMPLETED" : "IN_PROGRESS",
      startedAt: new Date(),
      completedAt: parsed.data.percent === 100 ? new Date() : null,
    },
    update: {
      percent: parsed.data.percent,
      status: parsed.data.percent === 100 ? "COMPLETED" : "IN_PROGRESS",
      completedAt: parsed.data.percent === 100 ? new Date() : null,
      offlineUpdatedAt: new Date(),
    },
  });
  return Response.json({ progress });
}
