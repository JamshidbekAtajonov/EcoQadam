import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { prisma } from "@/lib/db";

const schema = z.object({ challengeSlug: z.string().min(1) });

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 });
  if (!can(user.role, "challenge:participate")) return Response.json({ message: "Forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ message: "Invalid challenge" }, { status: 400 });

  const challenge = await prisma.challenge.findUnique({ where: { slug: parsed.data.challengeSlug } });
  if (!challenge) return Response.json({ message: "Challenge not found" }, { status: 404 });
  const existing = await prisma.challengeParticipation.findFirst({
    where: { userId: user.id, challengeId: challenge.id, status: { in: ["DRAFT", "REJECTED"] } },
  });
  if (existing) return Response.json({ participation: existing });

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + challenge.durationDays - 1);
  const participation = await prisma.challengeParticipation.create({
    data: { userId: user.id, challengeId: challenge.id, startDate, endDate },
  });
  return Response.json({ participation }, { status: 201 });
}
