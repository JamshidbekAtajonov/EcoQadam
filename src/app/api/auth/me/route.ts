import { getSession } from "@/lib/auth/session";

export async function GET() {
  const user = await getSession();
  return Response.json({ user }, { status: user ? 200 : 401 });
}
