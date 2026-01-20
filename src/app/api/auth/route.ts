import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendResetPasswordEmail } from "@/lib/sendgrid";


export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ ok: true });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ ok: true });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: hashedToken,
      resetTokenExpires: new Date(Date.now() + 1000 * 60 * 30), // 30 min
    },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;

  await sendResetPasswordEmail({
    to: user.email!,
    name: user.name,
    resetUrl,
  });

  return NextResponse.json({ ok: true });
}
