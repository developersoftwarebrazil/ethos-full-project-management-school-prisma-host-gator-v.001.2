import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { routeAccessMap } from "./lib/settings";

// Cria matchers por rota protegida
const protectedRoutes = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = auth();
  const pathname = req.nextUrl.pathname;

  /* ----------------------------------------
   * 1️⃣ ROTAS PÚBLICAS — NUNCA PROTEGER
   * --------------------------------------*/
  const publicRoutes = [
    "/sign-in",
    "/sign-up",
    "/unauthorized",
  ];

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  /* ----------------------------------------
   * 2️⃣ USUÁRIO NÃO LOGADO
   * --------------------------------------*/
  if (!userId) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  /* ----------------------------------------
   * 3️⃣ ROLE (vem do publicMetadata)
   * --------------------------------------*/
  const role =
    (sessionClaims?.publicMetadata as { role?: string })?.role ?? "";

  console.log("### MIDDLEWARE DEBUG ###");
  console.log("PATH:", pathname);
  console.log("USER:", userId);
  console.log("ROLE:", role);

  /* ----------------------------------------
   * 4️⃣ CONTROLE DE ACESSO POR ROLE
   * --------------------------------------*/
  for (const { matcher, allowedRoles } of protectedRoutes) {
    if (matcher(req) && !allowedRoles.includes(role)) {
      const url = req.nextUrl.clone();
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Protege tudo MENOS assets e rotas públicas
    "/((?!_next|favicon.ico|sign-in|sign-up|unauthorized).*)",
  ],
};
