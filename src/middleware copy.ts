import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routeAccessMap } from "./lib/settings";

/**
 * =========================================================
 * 🔁 CLERK (DESATIVADO TEMPORARIAMENTE)
 * Quando voltar a usar Clerk:
 *
 * 1) Descomente os imports abaixo
 * 2) Descomente o bloco clerkMiddleware
 * 3) Comente o bloco AUTH LOCAL
 * =========================================================
 */

// import { clerkMiddleware } from "@clerk/nextjs/server";

/**
 * =========================================================
 * 🔐 AUTH LOCAL (ATIVO)
 * =========================================================
 */

// Flags globais (Railway / .env)
const AUTH_DISABLED = process.env.DISABLE_AUTH === "true";
const ENABLE_REGISTER = process.env.ENABLE_REGISTER === "true";

/**
 * =========================================================
 * 📦 TIPOS
 * =========================================================
 */
type LocalSession = {
  userId: string;
  role: string;
};

/**
 * =========================================================
 * 🧭 ROTAS COM CONTROLE DE ROLE
 * =========================================================
 */
const matchers = Object.entries(routeAccessMap).map(
  ([route, allowedRoles]) => ({
    route,
    allowedRoles,
  })
);

/**
 * =========================================================
 * 🔐 MIDDLEWARE LOCAL
 * =========================================================
 */
export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const publicRoutes = [
  "/login",
  "/auth/login",
];

  /**
   * =====================================================
   * 🔓 BYPASS TOTAL (DEV / EMERGÊNCIA)
   * =====================================================
   */
  if (AUTH_DISABLED) {
    console.log("⚠️ AUTH DESATIVADO | Liberando:", pathname);
    return NextResponse.next();
  }

  /**
   * =====================================================
   * 🔐 Recupera sessão local
   * Cookie setado no /api/auth/login
   * =====================================================
   */
  const rawSession = req.cookies.get("session")?.value;

  let role = "";
  let userId: string | null = null;

  if (rawSession) {
    try {
      const parsed = JSON.parse(rawSession) as Partial<LocalSession>;
      role = parsed.role ?? "";
      userId = parsed.userId ?? null;
    } catch (err) {
      console.error("❌ Erro ao fazer parse do cookie de sessão", err);
    }
  }

  /**
   * =====================================================
   * 🧪 DEBUG
   * =====================================================
   */
  console.log("### MIDDLEWARE DEBUG ###");
  console.log("URL:", pathname);
  console.log("Role:", role || "NONE");
  console.log("UserId:", userId || "NONE");
  console.log("Session:", rawSession ? "OK" : "NULL");
  console.log("ENABLE_REGISTER:", ENABLE_REGISTER);

  /**
   * =====================================================
   * 🧾 CONTROLE DO REGISTER
   * =====================================================
   */
  if (pathname === "/register") {
    // Se register estiver desativado → bloqueia geral
    if (!ENABLE_REGISTER) {
      console.log("🚫 REGISTER DESATIVADO");
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // Se já estiver logado → não pode registrar de novo
    if (rawSession) {
      console.log("🔁 Usuário logado tentando acessar /register");
      const url = req.nextUrl.clone();
      url.pathname = `/${role || ""}`;
      return NextResponse.redirect(url);
    }

    // Register liberado e usuário não logado
    return NextResponse.next();
  }

  /**
   * =====================================================
   * 🔒 Sem sessão → redireciona para login
   * =====================================================
   */
  if (!rawSession && pathname !== "/auth/login") {
    console.log("🔒 Sem sessão → redirecionando para /login");
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  /**
   * =====================================================
   * 🔐 Verificação de acesso por ROLE
   * =====================================================
   */
  for (const { route, allowedRoles } of matchers) {
    if (pathname.startsWith(route)) {
      if (!allowedRoles.includes(role)) {
        console.log("⛔ Acesso negado à rota:", route);

        const url = req.nextUrl.clone();
        url.pathname = role ? `/${role}` : "/auth/login";
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

/**
 * =========================================================
 * 🔁 VERSÃO CLERK (DESATIVADA)
 * =========================================================
 */
/*
export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = auth();

  const role =
    (sessionClaims?.metadata as { role?: string })?.role ?? "";

  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(req)) {
      if (!allowedRoles.includes(role)) {
        const url = req.nextUrl.clone();
        url.pathname = "/unauthorized";
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
});
*/

/**
 * =========================================================
 * ⚙️ CONFIG
 * =========================================================
 */
export const config = {
  matcher: [
    "/((?!_next|login|register|unauthorized|api|trpc|.*\\.(?:png|jpg|jpeg|svg|css|js|ico|woff2?|ttf)).*)",
  ],
};
