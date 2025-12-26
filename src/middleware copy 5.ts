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

// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * =========================================================
 * 🔐 AUTH LOCAL (ATIVO)
 * =========================================================
 */

// Flag global (Railway / env)
const AUTH_DISABLED = process.env.DISABLE_AUTH === "true";

// Cria os matchers com base no routeAccessMap
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

  /**
   * 🔓 Bypass total (DEV / emergência)
   */
  if (AUTH_DISABLED) {
    console.log("⚠️ AUTH DESATIVADO | Liberando:", pathname);
    return NextResponse.next();
  }

  /**
   * =====================================================
   * 🔐 Recupera sessão local
   * (cookie setado no /api/auth/login)
   * =====================================================
   */
  const session = req.cookies.get("session")?.value;

  let role = "";

  if (session) {
    try {
      const parsed = JSON.parse(session);
      role = parsed.role ?? "";
    } catch (err) {
      console.error("Erro ao ler cookie de sessão", err);
    }
  }

  /**
   * =====================================================
   * 🧪 DEBUG
   * =====================================================
   */
  console.log("### MIDDLEWARE DEBUG ###");
  console.log("URL:", pathname);
  console.log("Role:", role);
  console.log("Session:", session ? "OK" : "NULL");

  /**
   * =====================================================
   * 🔐 Verificação de acesso por rota
   * =====================================================
   */
  for (const { route, allowedRoles } of matchers) {
    if (pathname.startsWith(route)) {
      if (!allowedRoles.includes(role)) {
        const url = req.nextUrl.clone();
        url.pathname = role ? `/${role}` : "/login";

        console.log(
          "🔒 Acesso negado → redirecionando para:",
          url.pathname
        );

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
    "/((?!_next|login|unauthorized|api|trpc|.*\\.(?:png|jpg|jpeg|svg|css|js|ico|woff2?|ttf)).*)",
  ],
};
