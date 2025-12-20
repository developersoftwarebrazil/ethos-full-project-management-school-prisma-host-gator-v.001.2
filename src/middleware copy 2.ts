import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { routeAccessMap } from "./lib/settings";

/* ----------------------------------------
 * MATCHERS DE ROTAS PROTEGIDAS
 * --------------------------------------*/
const protectedRoutes = Object.entries(routeAccessMap).map(
  ([route, roles]) => ({
    matcher: createRouteMatcher([route]),
    allowedRoles: roles,
  })
);

export default clerkMiddleware((auth, req) => {
  const { userId, sessionClaims } = auth();
  const { pathname } = req.nextUrl;

  /* ----------------------------------------
   * 1️⃣ ROTAS SEMPRE PÚBLICAS
   * --------------------------------------*/
  const publicRoutes = [
    "/",
    "/sign-in",
    "/sign-up",
    "/unauthorized",
  ];

  if (publicRoutes.some((route) => pathname === route)) {
    return NextResponse.next();
  }

  /* ----------------------------------------
   * 2️⃣ USUÁRIO NÃO LOGADO
   * --------------------------------------*/
  if (!userId) {
    const signInUrl = req.nextUrl.clone();
    signInUrl.pathname = "/sign-in";
    signInUrl.searchParams.set("redirect_url", pathname);
    return NextResponse.redirect(signInUrl);
  }

  /* ----------------------------------------
   * 3️⃣ ROLE DO USUÁRIO (Clerk Metadata)
   * --------------------------------------*/
  const role =
    (sessionClaims?.publicMetadata as { role?: string })?.role ?? "";

  console.log("🔐 MIDDLEWARE");
  console.log("PATH:", pathname);
  console.log("USER:", userId);
  console.log("ROLE:", role);

  /* ----------------------------------------
   * 4️⃣ REDIRECT AUTOMÁTICO APÓS LOGIN
   * --------------------------------------*/
  if (pathname === "/") {
    const dashboardUrl = req.nextUrl.clone();
    dashboardUrl.pathname = "/admin";
    return NextResponse.redirect(dashboardUrl);
  }

  /* ----------------------------------------
   * 5️⃣ CONTROLE DE ACESSO POR ROLE
   * --------------------------------------*/
  for (const { matcher, allowedRoles } of protectedRoutes) {
    if (matcher(req) && !allowedRoles.includes(role)) {
      const unauthorizedUrl = req.nextUrl.clone();
      unauthorizedUrl.pathname = "/unauthorized";
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  return NextResponse.next();
});

/* ----------------------------------------
 * CONFIG
 * --------------------------------------*/
export const config = {
  matcher: [
    "/((?!_next|favicon.ico|sign-in|sign-up|unauthorized).*)",
  ],
};
