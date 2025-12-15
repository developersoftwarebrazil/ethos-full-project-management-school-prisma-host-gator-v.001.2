import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { routeAccessMap } from "./lib/settings"; // Mapeamento das rotas com roles permitidos

// Configurando os matchers para cada rota e suas roles permitidas
const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route], // Roles permitidas para cada rota
}));

export default clerkMiddleware(async (auth, req) => {
  // 🔐 Clerk cuida do redirect automaticamente
  const { userId, sessionClaims } = auth();

  // Se o usuário não estiver logado, Clerk já redireciona automaticamente para /sign-in
  if (!userId) {
    return NextResponse.next();
  }

  // ✅ Recupera a role do usuário do metadata
  const role = (sessionClaims?.publicMetadata as { role?: string })?.role ?? "";

  // Debugging - verifique no console do servidor
  console.log("### MIDDLEWARE DEBUG ###");
  console.log("URL:", req.nextUrl.pathname);
  console.log("Role:", role);
  console.log("UserID:", userId);

  // Verifica se a rota bate e se o usuário tem permissão (role correta)
  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(req)) {
      if (!allowedRoles.includes(role)) {
        const url = req.nextUrl.clone();
        url.pathname = "/unauthorized"; // Redireciona para página de acesso não autorizado
        return NextResponse.redirect(url);
      }
    }
  }

  // Se passar por todas as verificações, segue com a requisição
  return NextResponse.next();
});

// Configuração para proteger as rotas e evitar loops no processo de login
export const config = {
  matcher: [
    "/((?!_next|sign-in|sign-up|unauthorized|api|trpc|clerk_).*)", // Protege todas as rotas, exceto as do Clerk e assets
  ],
};
