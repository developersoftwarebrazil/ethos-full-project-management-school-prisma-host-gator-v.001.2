import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * ================================
 * 🔁 CLERK (DESATIVADO)
 * Quando voltar a usar Clerk:
 * - autenticar via Clerk
 * - NÃO criar cookie manual
 * ================================
 */
// import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    // 🔴 Validação básica
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // 🔍 Busca usuário
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    // 🔐 Valida senha
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    /**
     * =========================================
     * 🔐 AUTH LOCAL — CRIA COOKIE DE SESSÃO
     * Compatível com src/lib/auth.ts
     * =========================================
     */
    const sessionData = JSON.stringify({
      userId: user.id,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      { status: 200 }
    );

    response.cookies.set({
      name: "session",
      value: sessionData,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;

    /**
     * =========================================
     * 🔁 CLERK (FUTURO)
     * Exemplo de fluxo quando reativar:
     * =========================================
     *
     * const { userId } = auth();
     * return NextResponse.json({ userId });
     *
     */
  } catch (error) {
    console.error("🔥 [LOGIN_ERROR]", error);
    return NextResponse.json(
      { error: "Erro interno no login" },
      { status: 500 }
    );
  }
}
