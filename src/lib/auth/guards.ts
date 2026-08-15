import { redirect } from "next/navigation";
import { can, type Permission } from "@/lib/auth/permissions";
import { getSession } from "@/lib/auth/session";

export async function requireUser() {
  const user = await getSession();
  if (!user) redirect("/login");
  return user;
}

export async function requirePermission(permission: Permission) {
  const user = await requireUser();
  if (!can(user.role, permission)) redirect("/?notice=forbidden");
  return user;
}
