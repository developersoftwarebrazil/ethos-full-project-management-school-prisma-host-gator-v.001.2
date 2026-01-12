import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";

export async function GET() {
  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(contacts);
}

export async function PATCH(req: Request) {
  const { id, isRead } = await req.json();

  await prisma.contact.update({
    where: { id },
    data: { isRead },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  await prisma.contact.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
