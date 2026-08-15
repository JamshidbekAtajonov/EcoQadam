import { z } from "zod";
import { can } from "@/lib/auth/permissions";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { calculateChallengeImpact } from "@/lib/impact";

const schema = z.object({
  participationId: z.string(),
  decision: z.enum(["APPROVED", "REJECTED"]),
  reason: z.string().trim().max(1000).optional(),
});

export async function POST(request: Request) {
  const reviewer = await getSession();
  if (!reviewer) return Response.json({ message: "Unauthorized" }, { status: 401 });
  if (!can(reviewer.role, "submission:verify")) return Response.json({ message: "Forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ message: "Invalid decision" }, { status: 400 });
  if (parsed.data.decision === "REJECTED" && !parsed.data.reason) {
    return Response.json({ message: "Rad etish sababi majburiy." }, { status: 400 });
  }

  const participation = await prisma.challengeParticipation.findUnique({
    where: { id: parsed.data.participationId },
    include: { challenge: true, dailyProgress: true, user: true },
  });
  if (!participation || participation.status !== "SUBMITTED") {
    return Response.json({ message: "Submission not found" }, { status: 404 });
  }
  if (reviewer.role !== "DISTRICT_ADMIN" && reviewer.schoolId !== participation.user.schoolId) {
    return Response.json({ message: "Forbidden" }, { status: 403 });
  }

  const completedDays = participation.dailyProgress.filter((day) => day.completed).length;
  const reportedValue = participation.dailyProgress.reduce((sum, day) => sum + (day.value ?? 0), 0);
  const metric = calculateChallengeImpact({ category: participation.challenge.category, completedDays, reportedValue });

  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.challengeParticipation.update({
      where: { id: participation.id },
      data: {
        status: parsed.data.decision,
        approvedAt: parsed.data.decision === "APPROVED" ? new Date() : null,
      },
    });
    await tx.verification.upsert({
      where: { participationId: participation.id },
      create: { participationId: participation.id, reviewerId: reviewer.id, status: parsed.data.decision, reason: parsed.data.reason },
      update: { reviewerId: reviewer.id, status: parsed.data.decision, reason: parsed.data.reason },
    });
    if (parsed.data.decision === "APPROVED") {
      await tx.impactMetric.create({
        data: {
          type: metric.type,
          value: metric.value,
          unit: metric.unit,
          participationId: participation.id,
          userId: participation.userId,
          classId: participation.user.classId,
          schoolId: participation.user.schoolId,
          districtId: participation.user.districtId,
        },
      });
    }
    return updated;
  });
  return Response.json({ participation: result, metric: parsed.data.decision === "APPROVED" ? metric : null });
}
