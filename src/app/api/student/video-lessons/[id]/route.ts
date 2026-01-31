
// src/app/api/student/video-lessons/[id]/route.ts
import { NextResponse } from "next/server";
import { requireStudent } from "@/lib/auth/require-student";
import prisma from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireStudent();

  if (!user.studentId) {
    return NextResponse.json({ error: "Student not linked" }, { status: 403 });
  }

  const student = await prisma.student.findUnique({
    where: { id: user.studentId },
  });

  const lesson = await prisma.videoLesson.findUnique({
    where: { id: params.id },
  });

  if (
    !lesson ||
    !lesson.published ||
    lesson.classId !== student?.classId
  ) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  return NextResponse.json(lesson);
}
