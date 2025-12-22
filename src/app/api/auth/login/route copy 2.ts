import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    // 🔴 Validação básica
    if (!username || !password) {
      return NextResponse.json(
        { message: "Username e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // 🔍 Busca usuário LOCAL (Clerk desativado)
    const user = await prisma.user.findUnique({
      where: { username },
    });

    // ❌ Usuário não encontrado
    if (!user) {
      return NextResponse.json(
        { message: "Usuário não encontrado" },
        { status: 401 }
      );
    }

    // 🔐 Verifica senha
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { message: "Senha inválida" },
        { status: 401 }
      );
    }

    // 🍪 Cria sessão simples (LOCAL AUTH)
    cookies().set("auth_user", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({
      message: "Login realizado com sucesso",
      role: user.role,
    });

  } catch (error) {
    console.error("[LOGIN_ERROR]", error);
    return NextResponse.json(
      { message: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
