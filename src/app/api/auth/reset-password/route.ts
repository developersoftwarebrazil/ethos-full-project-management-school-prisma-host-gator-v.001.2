import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();
    if (!token || !password) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await prisma.user.findFirst({
      where: { resetToken: hashedToken, resetTokenExpires: { gt: new Date() } },
    });

    if (!user) return NextResponse.json({ error: "Token inválido ou expirado" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetToken: null, resetTokenExpires: null },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("🔥 [RESET_PASSWORD_ERROR]", err);
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
  }
}
