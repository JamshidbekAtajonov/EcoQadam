import { can } from "@/lib/auth/permissions";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { storage } from "@/lib/storage";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 });
  if (!can(user.role, "evidence:upload")) return Response.json({ message: "Forbidden" }, { status: 403 });

  const form = await request.formData();
  const file = form.get("file");
  const challengeSlug = String(form.get("challengeSlug") ?? "");
  const caption = String(form.get("caption") ?? "");
  if (!(file instanceof File) || !ALLOWED_TYPES.has(file.type) || file.size > MAX_FILE_SIZE) {
    return Response.json({ message: "JPG, PNG yoki WebP rasm (8 MB gacha) yuklang." }, { status: 400 });
  }

  const participation = await prisma.challengeParticipation.findFirst({
    where: { userId: user.id, challenge: { slug: challengeSlug }, status: { in: ["DRAFT", "REJECTED"] } },
  });
  if (!participation) return Response.json({ message: "Active participation not found" }, { status: 404 });

  const stored = await storage.save({ bytes: new Uint8Array(await file.arrayBuffer()), filename: file.name, mimeType: file.type });
  const evidence = await prisma.evidence.create({
    data: { participationId: participation.id, storageKey: stored.key, url: stored.url, filename: stored.filename, mimeType: stored.mimeType, caption },
  });
  return Response.json({ evidence }, { status: 201 });
}
