import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { prisma } from "@/lib/db";

const schema = z.object({
  challengeSlug: z.string().min(1),
  dayIndex: z.number().int().min(0).max(60),
  completed: z.boolean(),
  value: z.number().nonnegative().optional(),
  note: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 });
  if (!can(user.role, "challenge:participate")) return Response.json({ message: "Forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ message: "Invalid progress" }, { status: 400 });

  const challenge = await prisma.challenge.findUnique({ where: { slug: parsed.data.challengeSlug } });
  if (!challenge) return Response.json({ message: "Challenge not found" }, { status: 404 });
  let participation = await prisma.challengeParticipation.findFirst({
    where: { userId: user.id, challengeId: challenge.id, status: { in: ["DRAFT", "REJECTED"] } },
  });
  if (!participation) {
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + challenge.durationDays - 1);
    participation = await prisma.challengeParticipation.create({ data: { userId: user.id, challengeId: challenge.id, startDate, endDate } });
  }

  const date = new Date(participation.startDate);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + parsed.data.dayIndex);
  const progress = await prisma.dailyProgress.upsert({
    where: { participationId_date: { participationId: participation.id, date } },
    create: { participationId: participation.id, date, completed: parsed.data.completed, value: parsed.data.value, note: parsed.data.note },
    update: { completed: parsed.data.completed, value: parsed.data.value, note: parsed.data.note, offlineUpdatedAt: new Date() },
  });
  return Response.json({ participation, progress });
}
