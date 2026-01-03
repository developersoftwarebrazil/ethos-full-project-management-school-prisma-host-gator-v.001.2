import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routeAccessMap } from "./lib/settings";

/**
 * =========================================================
 * 🔁 CLERK (DESATIVADO TEMPORARIAMENTE)
 * =========================================================
 */
// import { clerkMiddleware } from "@clerk/nextjs/server";

/**
 * =========================================================
 * 🔐 AUTH LOCAL (ATIVO)
 * =========================================================
 */

// Flags globais (.env / Railway)
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
 * 🌍 ROTAS PÚBLICAS (GUEST)
 * =========================================================
 * OBS:
 * "/" aponta para src/app/(public)/page.tsx (landing)
 */
const PUBLIC_ROUTES = [
  "/",               // landing page
  "/login",          // alias
  "/auth/login",     // login real
];

/**
 * =========================================================
 * 🧭 ROTAS COM CONTROLE DE ROLE
 * =========================================================
 */
const protectedRoutes = Object.entries(routeAccessMap).map(
  ([route, allowedRoles]) => ({
    route,
    allowedRoles,
  })
);

/**
 * =========================================================
 * 🔐 MIDDLEWARE
 * =========================================================
 */
export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

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
   * 🔍 VERIFICA SE ROTA É PÚBLICA
   * =====================================================
   */
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  /**
   * =====================================================
   * 🔐 RECUPERA COOKIE DE SESSÃO
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
      console.error("❌ Erro ao parsear cookie de sessão", err);
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
    if (!ENABLE_REGISTER) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    if (rawSession) {
      const url = req.nextUrl.clone();
      url.pathname = `/${role}`;
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  /**
   * =====================================================
   * 🔒 GUEST EM ROTA PROTEGIDA → LANDING PAGE
   * =====================================================
   */
  if (!rawSession && !isPublicRoute) {
    console.log("🔒 Guest em rota protegida → landing page");
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  /**
   * =====================================================
   * 🔁 LOGADO TENTANDO ACESSAR LOGIN
   * =====================================================
   */
  if (rawSession && (pathname === "/login" || pathname === "/auth/login")) {
    const url = req.nextUrl.clone();
    url.pathname = `/${role}`;
    return NextResponse.redirect(url);
  }

  /**
   * =====================================================
   * 🎭 CONTROLE DE ACESSO POR ROLE
   * =====================================================
   */
  for (const { route, allowedRoles } of protectedRoutes) {
    if (pathname.startsWith(route)) {
      if (!allowedRoles.includes(role)) {
        console.log("⛔ Acesso negado:", route);
        const url = req.nextUrl.clone();
        url.pathname = role ? `/${role}` : "/";
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

/**
 * =========================================================
 * ⚙️ CONFIG DO MATCHER
 * =========================================================
 */
export const config = {
  matcher: [
    "/((?!_next|unauthorized|api|trpc|.*\\.(?:png|jpg|jpeg|svg|css|js|ico|woff2?|ttf)).*)",
  ],
};
