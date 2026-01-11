import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // 🔥 REMOVE O COOKIE DE SESSÃO
  response.cookies.set({
    name: "session",
    value: "",
    maxAge: 0, // ← isso apaga o cookie
    path: "/",
  });

  return response;
}
