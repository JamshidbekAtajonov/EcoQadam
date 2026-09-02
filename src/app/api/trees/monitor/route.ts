import { can } from "@/lib/auth/permissions";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { storage } from "@/lib/storage";

const statuses = new Set(["HEALTHY", "NEEDS_ATTENTION", "DEAD"] as const);

export async function POST(request: Request) {
  const user = await getSession();
  if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 });
  if (!can(user.role, "tree:monitor")) return Response.json({ message: "Forbidden" }, { status: 403 });
  const form = await request.formData();
  const identifier = String(form.get("treeIdentifier") ?? "");
  const status = String(form.get("status") ?? "") as "HEALTHY" | "NEEDS_ATTENTION" | "DEAD";
  const watered = form.get("watered") === "on";
  const notes = String(form.get("notes") ?? "").slice(0, 1000);
  if (!statuses.has(status)) return Response.json({ message: "Invalid tree status" }, { status: 400 });

  const tree = await prisma.tree.findUnique({ where: { identifier } });
  if (!tree) return Response.json({ message: "Tree not found" }, { status: 404 });
  const file = form.get("file");
  let photoUrl: string | undefined;
  if (file instanceof File && file.size > 0) {
    if (file.size > 4 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      return Response.json({ message: "JPG, PNG yoki WebP rasm (4 MB gacha) yuklang." }, { status: 400 });
    }
    photoUrl = (await storage.save({ bytes: new Uint8Array(await file.arrayBuffer()), filename: file.name, mimeType: file.type })).url;
  }

  const now = new Date();
  const survived = status !== "DEAD";
  const record = await prisma.$transaction(async (tx) => {
    const monitoring = await tx.treeMonitoringRecord.create({
      data: { treeId: tree.id, observerId: user.id, status, survived, notes, photoUrl, wateredAt: watered ? now : null },
    });
    await tx.tree.update({
      where: { id: tree.id },
      data: { status, survived, lastCheckedAt: now, lastWateredAt: watered ? now : tree.lastWateredAt },
    });
    return monitoring;
  });
  return Response.json({ record }, { status: 201 });
}
