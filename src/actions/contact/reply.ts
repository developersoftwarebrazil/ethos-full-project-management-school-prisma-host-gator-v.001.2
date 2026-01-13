"use server";

import prisma from "@/lib/prisma";
import { sendReplyEmail } from "@/lib/sendgrid";

type ReplyPayload = {
  id: number;
  reply: string;
};

export async function replyContact({ id, reply }: ReplyPayload) {
  const contact = await prisma.contact.findUnique({
    where: { id },
  });

  if (!contact) {
    throw new Error("Mensagem não encontrada");
  }

  // 🔎 LOG DE DEBUG (AQUI 👇)
  console.log("📧 ENVIANDO EMAIL PARA:", contact.email);

  // 📧 Envia email
  await sendReplyEmail({
    to: contact.email,
    name: contact.name,
    message: contact.message,
    reply,
  });

  // 📝 Atualiza banco
  await prisma.contact.update({
    where: { id },
    data: {
      reply,
      repliedAt: new Date(),
      isRead: true,
    },
  });

  console.log("✅ EMAIL ENVIADO E CONTATO ATUALIZADO:", contact.id);

  return { success: true };
}
