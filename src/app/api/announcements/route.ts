// src/app/api/announcements/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
  try {
    /**
     * ================================
     * 🔐 AUTH LOCAL (COOKIE)
     * ================================
     */
    const cookieStore = cookies();
    const session = cookieStore.get("session");

    if (!session) {
      return NextResponse.json([], { status: 200 });
    }

    const parsed = JSON.parse(session.value);
    const role = parsed.role;
    const userId = parsed.id;

    /**
     * ================================
     * 🔁 CLERK (REFERÊNCIA FUTURA)
     * ================================
     * const { userId, sessionClaims } = auth();
     * const role = sessionClaims?.metadata?.role;
     */

    const roleConditions: any = {
      teacher: { lessons: { some: { teacherId: userId } } },
      student: { students: { some: { id: userId } } },
      parent: { students: { some: { parentId: userId } } },
    };

    const announcements = await prisma.announcement.findMany({
      take: 3,
      orderBy: { date: "desc" },
      where: {
        ...(role !== "admin" && {
          OR: [
            { classId: null },
            { class: roleConditions[role] || {} },
          ],
        }),
      },
    });

    return NextResponse.json(announcements);
  } catch (err) {
    console.error(err);
    return NextResponse.json([], { status: 500 });
  }
}
