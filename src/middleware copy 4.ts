import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { routeAccessMap } from "./lib/settings";

// Flag para desativar autenticação
const AUTH_DISABLED = process.env.DISABLE_AUTH === "true";

// Cria os matchers com roles permitidas
const matchers = Object.entries(routeAccessMap).map(
  ([route, allowedRoles]) => ({
    matcher: createRouteMatcher([route]),
    allowedRoles,
  })
);

export default clerkMiddleware(async (auth, req) => {
  // BYPASS TOTAL
  if (AUTH_DISABLED) {
    console.log(
      "AUTH DESATIVADO - liberando rota:",
      req.nextUrl.pathname
    );
    return NextResponse.next();
  }

  // Autenticação normal
  const { userId, sessionClaims } = auth();

  const role =
    (sessionClaims?.metadata as { role?: string })?.role ?? "";

  // Debug
  console.log("MIDDLEWARE DEBUG");
  console.log("URL:", req.nextUrl.pathname);
  console.log("UserID:", userId);
  console.log("Role:", role);

  // Verificação de acesso
  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(req)) {
      if (!allowedRoles.includes(role)) {
        const url = req.nextUrl.clone();
        url.pathname = role ? `/${role}` : "/unauthorized";
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|png|jpg|jpeg|svg|gif|webp|ico|woff2?|ttf)).*)",
    "/(api|trpc)(.*)",
  ],
};
