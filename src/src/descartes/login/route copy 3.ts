import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

/**
 * =========================================
 * 🔐 AUTH PROVIDER
 * local  -> cookie + prisma
 * clerk  -> clerk
 * =========================================
 */
const AUTH_PROVIDER = process.env.AUTH_PROVIDER ?? "local";

/**
 * =========================================
 * TYPES COMPARTILHADOS
 * =========================================
 */
type AuthUser = {
  id: string;
  role: string;
};

type LocalSession = {
  userId: string;
  role: string;
};

/**
 * =========================================
 * 🔐 LOCAL AUTH
 * =========================================
 */
async function getLocalUser(): Promise<AuthUser | null> {
  const sessionCookie = cookies().get("session")?.value;
  if (!sessionCookie) return null;

  let session: LocalSession;

  try {
    session = JSON.parse(sessionCookie);
  } catch {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  if (!user) return null;

  return {
    id: user.id,
    role: user.role,
  };
}

async function getLocalRole(): Promise<string | null> {
  const sessionCookie = cookies().get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const session = JSON.parse(sessionCookie) as LocalSession;
    return session.role;
  } catch {
    return null;
  }
}

/**
 * =========================================
 * 🔁 CLERK AUTH
 * (fica aqui, mas só roda se ativar)
 * =========================================
 */
async function getClerkUser(): Promise<AuthUser | null> {
  const { currentUser } = await import("@clerk/nextjs/server");

  const user = await currentUser();
  if (!user) return null;

  return {
    id: user.id,
    role: user.publicMetadata.role as string,
  };
}

async function getClerkRole(): Promise<string | null> {
  const { auth } = await import("@clerk/nextjs/server");

  const { sessionClaims } = auth();
  return (sessionClaims?.metadata as { role?: string })?.role ?? null;
}

/**
 * =========================================
 * 🚀 API PÚBLICA (USADA PELO APP)
 * =========================================
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  if (AUTH_PROVIDER === "clerk") {
    return getClerkUser();
  }

  return getLocalUser();
}

export async function getAuthRole(): Promise<string | null> {
  if (AUTH_PROVIDER === "clerk") {
    return getClerkRole();
  }

  return getLocalRole();
}

/**
 * =========================================
 * 🔒 GUARDA DE ROTA (OPCIONAL)
 * =========================================
 */
export async function requireAuth() {
  const user = await getAuthUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  return user;
}
