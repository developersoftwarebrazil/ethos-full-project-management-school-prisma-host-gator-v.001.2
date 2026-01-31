// src/lib/auth/require-admin.ts
import { requireAuth } from "./require-auth";

export async function requireAdmin() {
  const user = await requireAuth();

  if (user.role !== "admin") {
    throw new Error("Forbidden: Admin only");
  }

  return user;
}
