import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

/**
 * ================================
 * 🔁 CLERK (DESATIVADO)
 * Para reativar:
 *
 * 1) Descomentar os imports abaixo
 * 2) Trocar a implementação de getAuthUser / getAuthRole
 * 3) Garantir clerkMiddleware no middleware.ts
 *
 * import { auth } from "@clerk/nextjs/server";
 * ================================
 */

/**
 * ================================
 * TIPOS COMPARTILHADOS
 * ================================
 */
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
 */
function getLocalSession(): LocalSession | null {
  const value = cookies().get("session")?.value;
  if (!value) return null;

  try {
    return JSON.parse(value) as LocalSession;
  } catch {
    return null;
  }
}

/**
 * ================================
 * 🚀 API PÚBLICA DE AUTH
 * ================================
 */

/**
 * Retorna o usuário autenticado
 * - Local: cookie + prisma
 * - Clerk: auth() + prisma (quando reativar)
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  /**
   * ================================
   * 🔁 CLERK (DESATIVADO)
   * ================================
   */
  // const { userId, sessionClaims } = auth();
  // if (!userId) return null;
  //
  // return {
  //   id: userId,
  //   role: (sessionClaims?.metadata as { role?: string })?.role ?? "user",
  // };

  /**
   * ================================
   * 🔐 LOCAL AUTH
   * ================================
   */
  const session = getLocalSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      role: true,
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    role: user.role,
  };
}

/**
 * Retorna apenas o role do usuário
 */
export async function getAuthRole(): Promise<string | null> {
  /**
   * ================================
   * 🔁 CLERK (DESATIVADO)
   * ================================
   */
  // const { sessionClaims } = auth();
  // return (sessionClaims?.metadata as { role?: string })?.role ?? null;

  /**
   * ================================
   * 🔐 LOCAL AUTH
   * ================================
   */
  return getLocalSession()?.role ?? null;
}

/**
 * ================================
 * 🔒 GUARDA DE ROTA
 * ================================
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  return user;
}
/**
 * Retorna apenas o ID do usuário autenticado
 */
export async function getCurrentUserId(): Promise<string | null> {
  /**
   * ================================
   * 🔁 CLERK (DESATIVADO)
   * ================================
   */
  // const { userId } = auth();
  // return userId ?? null;

  /**
   * ================================
   * 🔐 LOCAL AUTH
   * ================================
   */
  return getLocalSession()?.userId ?? null;
}
/**
 * Retorna o ID do usuário ou lança erro se não autenticado
 */
export async function requireUserId(): Promise<string> {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("UNAUTHORIZED");
  }

  return userId;
}
