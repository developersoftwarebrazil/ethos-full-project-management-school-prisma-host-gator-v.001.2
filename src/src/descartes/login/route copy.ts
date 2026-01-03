import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    console.log("🟢 [REGISTER] Request recebida");

    const body = await req.json();
    console.log("📦 [REGISTER] Body recebido:", body);

    const { name, username, password, role } = body;

    // 🔴 Validação
    if ( !username || !password) {
      console.warn("⚠️ [REGISTER] Dados incompletos");
      return NextResponse.json(
        { message: "username e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // 🔍 Verifica se já existe
    console.log(`🔍 [REGISTER] Verificando se usuário "${username}" existe...`);
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      console.warn("⚠️ [REGISTER] Usuário já existe:", existingUser);
      return NextResponse.json(
        { message: "Usuário já existe" },
        { status: 409 }
      );
    }
    console.log("👤 [REGISTER] Usuário existente:", existingUser);

    // 🔐 Hash da senha
    console.log("🔐 [REGISTER] Gerando hash da senha...");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("✅ [REGISTER] Hash gerado");

    // ✅ Criação do usuário
    console.log("💾 [REGISTER] Criando usuário no banco...");
    const user = await prisma.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
        role: role ?? "ADMIN",
      },
    });
    console.log("🎉 [REGISTER] Usuário criado:", {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
    });

    return NextResponse.json(
      {
        message: "Usuário criado com sucesso",
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("🔥 [REGISTER_ERROR]", error);
    return NextResponse.json(
      { message: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
