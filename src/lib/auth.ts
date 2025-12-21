import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function getCurrentUser() {
  const session = cookies().get("session")?.value;
  if (!session) return null;

  return prisma.user.findUnique({
    where: { id: session }, // ✅ string
  });
}

export async function getRole() {
  const user = await getCurrentUser();
  return user?.role ?? null;
}
