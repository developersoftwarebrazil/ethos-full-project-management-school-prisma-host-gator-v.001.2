"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-current-user";

export async function getTeacherVideoLesson(id: string) {
  const user = await getCurrentUser();

  if (!user || user.role !== "teacher") {
    return null;
  }

  // 🔎 buscar teacher real
  const teacher = await prisma.teacher.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!teacher) {
    console.error("Teacher não encontrado para user:", user.id);
    return null;
  }

  // ✅ filtro CORRETO
  const lesson = await prisma.videoLesson.findFirst({
    where: {
      id,
      teacherId: teacher.id,
    },
  });

  console.log("LESSON FOUND:", lesson?.id);

  return lesson;
}
