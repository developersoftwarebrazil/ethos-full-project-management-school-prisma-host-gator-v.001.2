// src/lib/auth/require-auth.ts

import { getCurrentUser } from "./get-current-user";


export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}
