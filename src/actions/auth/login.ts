"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";

/**
 * ================================
 * 🔑 LOGIN (EXTRAÍDO DO auth.ts)
 * ================================
 * 🆕 NOVO ARQUIVO
 * Responsável APENAS por autenticar
 * e criar o cookie de sessão
 */
export async function loginAction(
  email: string,
  password: string
) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: "Credenciais inválidas" };
  }

  const passwordMatch = await compare(password, user.password);

  if (!passwordMatch) {
    return { error: "Credenciais inválidas" };
  }

  /**
   * ================================
   * 🍪 CRIAÇÃO DA SESSÃO
   * ================================
   * 🔁 EXTRAÍDO do fluxo antigo
   */
  cookies().set(
    "session",
    JSON.stringify({
      userId: user.id,
      role: user.role,
      username: user.username,
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    }
  );

  /**
   * ================================
   * 🚀 REDIRECT PÓS-LOGIN
   * ================================
   */
  redirect("/dashboard");
}
