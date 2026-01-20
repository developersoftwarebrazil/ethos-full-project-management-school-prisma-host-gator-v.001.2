import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(req: Request) {
  const auth = await requireAuth();

  if (auth.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { username, name, role, password, email } = await req.json();

  if (!username || !name || !role || !password) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      name,
      role,
      email,
      password: hashedPassword,
    },
  });

  return NextResponse.json({ ok: true, userId: user.id });
}
