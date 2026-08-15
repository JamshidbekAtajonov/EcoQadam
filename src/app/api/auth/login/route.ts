import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth/session";

const loginSchema = z.object({
  identifier: z.string().trim().min(3).max(120),
  password: z.string().min(6).max(100),
});

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: "Email/telefon yoki parol noto‘g‘ri." }, { status: 400 });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        isActive: true,
        OR: [{ email: parsed.data.identifier.toLowerCase() }, { phone: parsed.data.identifier }],
      },
      include: { role: true },
    });

    if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
      return NextResponse.json({ message: "Email/telefon yoki parol noto‘g‘ri." }, { status: 401 });
    }

    const token = await createSessionToken({
      id: user.id,
      name: user.name,
      role: user.role.key,
      schoolId: user.schoolId,
      classId: user.classId,
      districtId: user.districtId,
    });

    const response = NextResponse.json({ user: { name: user.name, role: user.role.key } });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Login failed", error);
    return NextResponse.json({ message: "Ma’lumotlar bazasiga ulanib bo‘lmadi." }, { status: 503 });
  }
}
