// src/app/api/student/video-lessons/[id]/route.ts
import { NextResponse } from "next/server";
import { requireStudent } from "@/lib/auth/require-student";
import prisma from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  // 🔐 já retorna o Student autenticado
  const student = await requireStudent();

  const lesson = await prisma.videoLesson.findUnique({
    where: { id: params.id },
  });

  if (
    !lesson ||
    !lesson.published ||
    lesson.classId !== student.classId
  ) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  return NextResponse.json(lesson);
}
