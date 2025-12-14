import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routeAccessMap } from "./lib/settings";
import { NextResponse } from "next/server";

const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims, userId } = auth();

  // 🔐 Se não está logado → manda para /sign-in
  if (!userId) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  // ✅ Pega a role corretamente
  const role = (sessionClaims?.publicMetadata as { role?: string })?.role ?? "";

  console.log("### MIDDLEWARE DEBUG ###");
  console.log("URL:", req.nextUrl.pathname);
  console.log("Role:", role);
  console.log("UserID:", userId);

  // Loop para verificar acesso
  for (const { matcher, allowedRoles } of matchers) {
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
    "/((?!_next|sign-in|sign-up|unauthorized|api|trpc).*)",
  ],
};
