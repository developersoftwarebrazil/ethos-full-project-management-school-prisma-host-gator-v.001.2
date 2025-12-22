import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, username, password, role } = body;

    // 🔴 Validação
    if (!name || !username || !password) {
      return NextResponse.json(
        { message: "Nome, username e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // 🔍 Verifica se já existe
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Usuário já existe" },
        { status: 409 }
      );
    }

    // 🔐 Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Criação do usuário
    const user = await prisma.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
        role: role ?? "ADMIN",
      },
    });

    return NextResponse.json(
      {
        message: "Usuário criado com sucesso",
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);
    return NextResponse.json(
      { message: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
