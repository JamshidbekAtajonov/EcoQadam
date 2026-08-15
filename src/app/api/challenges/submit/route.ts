import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { prisma } from "@/lib/db";

const schema = z.object({ challengeSlug: z.string(), comment: z.string().max(1000).optional() });

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 });
  if (!can(user.role, "challenge:participate")) return Response.json({ message: "Forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ message: "Invalid submission" }, { status: 400 });

  const participation = await prisma.challengeParticipation.findFirst({
    where: { userId: user.id, challenge: { slug: parsed.data.challengeSlug }, status: { in: ["DRAFT", "REJECTED"] } },
    include: { dailyProgress: true },
  });
  if (!participation) return Response.json({ message: "Participation not found" }, { status: 404 });
  if (!participation.dailyProgress.some((day) => day.completed)) {
    return Response.json({ message: "Kamida bir kunlik natijani belgilang." }, { status: 400 });
  }

  const submitted = await prisma.challengeParticipation.update({
    where: { id: participation.id },
    data: { status: "SUBMITTED", submittedAt: new Date(), comment: parsed.data.comment },
  });
  return Response.json({ participation: submitted });
}
