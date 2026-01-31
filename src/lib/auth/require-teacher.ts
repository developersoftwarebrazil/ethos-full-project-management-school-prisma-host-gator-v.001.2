// src/lib/auth/require-teacher.ts
import { requireAuth } from "./require-auth";

export async function requireTeacher() {
  const user = await requireAuth();

  if (user.role !== "teacher") {
    throw new Error("Forbidden: Teacher only");
  }

  return user;
}
