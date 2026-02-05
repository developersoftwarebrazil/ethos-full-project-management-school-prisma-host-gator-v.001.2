import prisma from "@/lib/prisma";

export async function getVideoLessonById(id: string) {
  if (!id) return null;

  const lesson = await prisma.videoLesson.findUnique({
    where: { id },
    include: {
      teacher: {
        select: {
          id: true,
          name: true,
        },
      },
      subject: true,
      class: true,
    },
  });

  return lesson;
}
