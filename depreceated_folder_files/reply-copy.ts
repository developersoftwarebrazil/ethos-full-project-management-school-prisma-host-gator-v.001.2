"use server";

import prisma from "@/lib/prisma";

type ReplyPayload = {
  id: number ;
  reply: string | null;
};

export async function replyContact({ id, reply }: ReplyPayload) {
  if (!reply?.trim()) {
    throw new Error("Resposta vazia");
  }

  await prisma.contact.update({
    where: { id  },
    data: {
      reply,
      repliedAt: new Date(),
      isRead: true,
    },
  });

  return { success: true };
}
