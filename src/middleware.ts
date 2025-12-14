import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routeAccessMap } from "./lib/settings";
import { NextResponse } from "next/server";

const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims, userId } = auth();

  const pathname = req.nextUrl.pathname;

  // ✅ Rotas públicas (NUNCA bloquear)
  const publicRoutes = [
    "/sign-in",
    "/sign-up",
    "/unauthorized",
  ];

  if (!userId && !publicRoutes.includes(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  // Se ainda não logou, deixa passar (sign-in, etc)
  if (!userId) {
    return NextResponse.next();
  }

  // ✅ Role
  const role =
    (sessionClaims?.publicMetadata as { role?: string })?.role ?? "";

  console.log("### MIDDLEWARE DEBUG ###");
  console.log("URL:", pathname);
  console.log("Role:", role);
  console.log("UserID:", userId);

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

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|css|js|woff2)).*)",
    "/(api|trpc)(.*)",
  ],
};
