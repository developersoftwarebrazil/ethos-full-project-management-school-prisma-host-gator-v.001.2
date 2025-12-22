import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username e senha são obrigatórios" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    // 🔐 Cria cookie de sessão
    const response = NextResponse.json(
      { id: user.id, username: user.username, role: user.role },
      { status: 200 }
    );

    const sessionData = JSON.stringify({ role: user.role });
    response.cookies.set({
      name: "session",
      value: sessionData,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("🔥 [LOGIN_ERROR]", error);
    return NextResponse.json(
      { error: "Erro interno no login" },
      { status: 500 }
    );
  }
}
