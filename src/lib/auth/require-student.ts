// src/lib/auth/require-student.ts
import { requireAuth } from "./require-auth";

export async function requireStudent() {
  const user = await requireAuth();

  if (user.role !== "student") {
    throw new Error("Forbidden: Student only");
  }

  return user;
}
