import { storage } from "@/lib/storage";
import { getSession } from "@/lib/auth/session";

export async function GET(_request: Request, context: RouteContext<"/api/files/[key]">) {
  const user = await getSession();
  if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 });
  const { key } = await context.params;
  try {
    const file = await storage.read(key);
    return new Response(file.bytes as BodyInit, {
      headers: { "Content-Type": file.mimeType, "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return Response.json({ message: "File not found" }, { status: 404 });
  }
}
