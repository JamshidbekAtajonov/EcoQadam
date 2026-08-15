import { getSession } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";

type Scope = "student" | "class" | "school" | "mahalla" | "district";

export async function GET(request: Request) {
  const user = await getSession();
  if (!user) return Response.json({ message: "Unauthorized" }, { status: 401 });
  const scope = new URL(request.url).searchParams.get("scope") as Scope | null;
  if (!scope || !isAllowedScope(user.role, scope)) return Response.json({ message: "Forbidden" }, { status: 403 });

  const fallbackClass = !user.classId && user.schoolId
    ? await prisma.class.findFirst({ where: { schoolId: user.schoolId }, orderBy: { name: "asc" }, select: { id: true } })
    : null;
  const targetClassId = user.classId ?? fallbackClass?.id ?? "__none__";
  const targetStudent = user.role === "STUDENT" ? { id: user.id } : await prisma.user.findFirst({
    where: { role: { key: "STUDENT" }, ...(targetClassId !== "__none__" ? { classId: targetClassId } : { districtId: user.districtId ?? "__none__" }) },
    orderBy: { name: "asc" },
    select: { id: true },
  });
  let mahallaId = "__none__";
  if (scope === "mahalla") {
    const mahalla = await prisma.mahalla.findFirst({ where: { districtId: user.districtId ?? "__none__" }, orderBy: { name: "asc" }, select: { id: true } });
    mahallaId = mahalla?.id ?? "__none__";
  }

  let where: Prisma.ImpactMetricWhereInput;
  if (scope === "student") where = { userId: targetStudent?.id ?? "__none__" };
  else if (scope === "class") where = { classId: targetClassId };
  else if (scope === "school") where = { schoolId: user.schoolId ?? "__none__" };
  else if (scope === "district") where = { districtId: user.districtId ?? "__none__" };
  else where = { mahallaId };

  const metrics = await prisma.impactMetric.groupBy({ by: ["type"], where, _sum: { value: true } });
  const value = (type: string) => metrics.find((metric) => metric.type === type)?._sum.value ?? 0;
  const studentWhere: Prisma.UserWhereInput = scope === "student" ? { id: targetStudent?.id ?? "__none__" }
    : scope === "class" ? { classId: targetClassId }
    : scope === "school" ? { schoolId: user.schoolId ?? "__none__" }
    : scope === "mahalla" ? { school: { mahallaId } }
    : { districtId: user.districtId ?? "__none__" };
  const students = await prisma.user.count({ where: { ...studentWhere, role: { key: "STUDENT" }, lastActiveAt: { gte: new Date(Date.now() - 30 * 86400000) } } });

  return Response.json({ summary: { water: value("WATER_SAVED_LITERS"), tasks: value("TASKS_COMPLETED"), students } });
}

function isAllowedScope(role: string, scope: Scope) {
  if (scope === "student") return true;
  if (scope === "class") return role !== "STUDENT";
  if (scope === "school") return role === "SCHOOL_ADMIN" || role === "DISTRICT_ADMIN" || can(role as "TEACHER", "dashboard:school");
  return role === "DISTRICT_ADMIN";
}
