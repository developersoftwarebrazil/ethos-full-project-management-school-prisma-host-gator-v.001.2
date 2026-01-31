import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

type LocalSession = {
  userId: string;
  role: string;
};

type AuthUser = {
  id: string;
  role: string;
};

/**
 * ================================
 * 🔐 SESSION LOCAL (COOKIE)
 * ================================
 * ⚠️ NÃO ALTERADO
 * Apenas leitura da sessão existente
 */
function readSession(): LocalSession | null {
  const cookie = cookies().get("session");
  if (!cookie) return null;

  try {
    return JSON.parse(cookie.value) as LocalSession;
  } catch {
    return null;
  }
}

/**
 * ================================
 * 👤 USUÁRIO AUTENTICADO
 * ================================
 * ⚠️ NÃO ALTERADO
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  const session = readSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      role: true,
    },
  });

  return user ?? null;
}

/**
 * ================================
 * 🎭 ROLE
 * ================================
 * ⚠️ NÃO ALTERADO
 */
export async function getAuthRole(): Promise<string | null> {
  return readSession()?.role ?? null;
}

/**
 * ================================
 * 🔒 GUARDA DE ROTA
 * ================================
 * ⚠️ NÃO ALTERADO
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

/**
 * ================================
 * 🆔 USER ID
 * ================================
 * ⚠️ NÃO ALTERADO
 */
export async function getCurrentUserId(): Promise<string | null> {
  return readSession()?.userId ?? null;
}

export async function requireUserId(): Promise<string> {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/login");
  }

  return userId;
}

export async function requireTeacher(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { teacher: true },
  });

  if (!user || user.role !== "teacher" || !user.teacher) {
    throw new Error("Acesso negado");
  }

  return user.teacher;
}
