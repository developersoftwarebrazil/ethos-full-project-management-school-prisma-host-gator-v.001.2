import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routeAccessMap } from "./lib/settings";
import { NextResponse } from "next/server";

const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims, userId } = auth();

  const role =
    (sessionClaims?.metadata as { role?: string })?.role?.toString() ?? "";

  // Debug logs
  console.log("### MIDDLEWARE DEBUG ###");
  console.log("URL:", req.nextUrl.pathname);
  console.log("Role:", role);
  console.log("SessionClaims:", sessionClaims);
  console.log("UserID:", userId);

  // Loop through route matchers
  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(req)) {
      // Rota bateu → verificar permissões
      if (!allowedRoles.includes(role)) {
        const redirectTo = role ? `/${role}` : "/unauthorized";
        console.log("🔒 Acesso negado! Redirecionando para:", redirectTo);

        const url = req.nextUrl.clone();
        url.pathname = redirectTo;

        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // protege todas as rotas exceto assets
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
