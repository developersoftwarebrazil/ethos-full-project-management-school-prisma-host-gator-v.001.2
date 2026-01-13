import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendReplyEmail } from "@/lib/sendgrid";

export async function POST(req: Request) {
  const { id, reply } = await req.json();

  const contact = await prisma.contact.update({
    where: { id: Number(id) },
    data: {
      reply,
      repliedAt: new Date(),
      isRead: true,
    },
  });

  // 📧 Enviar e-mail
  await sendReplyEmail({
    to: contact.email,
    name: contact.name,
    message: contact.message,
    reply,
  });

  return NextResponse.json({ success: true });
}
