// src/lib/auth/get-current-user.ts
import { cookies } from "next/headers";
import prisma from "../prisma";

export async function getCurrentUser() {
  const session = cookies().get("session")?.value;

  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session },
  });

  return user;
}
