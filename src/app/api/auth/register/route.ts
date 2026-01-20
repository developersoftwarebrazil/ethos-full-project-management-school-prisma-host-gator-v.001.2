import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  console.log("🟢 [REGISTER] Request recebida");

  try {
    const body = await req.json();
    console.log("📦 [REGISTER] Body recebido:", body);

    const { username, name,email, password, role } = body;

    // 🔴 Validação
    if (!username || !name || !email  || !password) {
      console.log("🔴 [REGISTER] Dados inválidos");
      return NextResponse.json(
        { message: "Username, nome e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // 🔍 Verifica se usuário já existe
    console.log("🔍 [REGISTER] Verificando se usuário existe...");
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    console.log("👤 [REGISTER] Usuário existente:", existingUser);

    if (existingUser) {
      console.log("⚠️ [REGISTER] Usuário já existe");
      return NextResponse.json(
        { message: "Usuário já existe" },
        { status: 409 }
      );
    }

    // 🔐 Hash da senha
    console.log("🔐 [REGISTER] Gerando hash da senha...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("✅ [REGISTER] Hash gerado");

    // 💾 Criando usuário
    console.log("💾 [REGISTER] Criando usuário no banco...");
    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        role: role ?? "USER", // default
      },
    });

    console.log("🎉 [REGISTER] Usuário criado:", user);

    return NextResponse.json(
      {
        message: "Usuário criado com sucesso",
        userId: user.id,
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("🔥 [REGISTER_ERROR]", error);

    // Erro específico do Prisma
    if (error.code) {
      console.error("🧨 Prisma error code:", error.code);
      console.error("🧨 Prisma meta:", error.meta);
    }

    return NextResponse.json(
      { message: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
