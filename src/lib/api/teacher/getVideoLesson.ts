import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/get-current-user";

export async function getTeacherVideoLesson(id: string) {
  const user = await getCurrentUser();

  if (!user || user.role !== "teacher") {
    return null;
  }

  const lesson = await prisma.videoLesson.findFirst({
    where: {
      id,
      teacherId: user.id, // ✅ AGORA BATE
    },
  });

  console.log("LESSON FOUND:", lesson?.id);

  return lesson;
}
