"use server";

import prisma from "@/lib/prisma";
import crypto from "crypto";
import { sendResetPasswordEmail } from "@/lib/sendgrid";

export async function forgotPassword(email: string): Promise<{ ok: boolean }> {
  try {
    // Se estiver no browser, window.location.origin existe
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_URL;

    const res = await fetch(`${baseUrl}/api/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    return { success: res.ok, ...data };
  } catch (err) {
    console.error("🔥 [FORGOT_PASSWORD_ACTION_ERROR]", err);
    return { ok: false };
  }
}
