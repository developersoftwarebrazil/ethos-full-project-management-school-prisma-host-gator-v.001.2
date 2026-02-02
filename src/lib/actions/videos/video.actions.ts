"use server";

import prisma from "@/lib/prisma";
import { videoLessonSchema } from "@/lib/formValidationSchemas";
import { getCurrentUser } from "@/lib/auth/get-current-user";

export async function createVideoLesson(_: any, data: any) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "teacher") {
      return { success: false, error: true };
    }

    const parsed = videoLessonSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: true };
    }

    await prisma.videoLesson.create({
      data: {
        ...parsed.data,

        // 🔐 autor (snapshot)
        authorId: user.id,
        authorName: user.name,
        authorRole: user.role,

        // relacionamento atual
        teacherId: user.id,
      },
    });

    return { success: true, error: false };
  } catch (e) {
    console.error(e);
    return { success: false, error: true };
  }
}
