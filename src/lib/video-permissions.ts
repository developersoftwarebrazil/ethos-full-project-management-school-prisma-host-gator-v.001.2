import prisma from "@/lib/prisma";

export async function canWatchVideoLesson(
  studentId: string,
  videoLessonId: string
) {
  // 1️⃣ Busca a video aula
  const videoLesson = await prisma.videoLesson.findUnique({
    where: { id: videoLessonId },
    select: {
      isActive: true,
      classId: true,
    },
  });

  if (!videoLesson || !videoLesson.isActive) {
    return { allowed: false, reason: "Aula indisponível" };
  }

  // 2️⃣ Verifica se o aluno pertence à turma
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { classId: true },
  });

  if (!student || student.classId !== videoLesson.classId) {
    return { allowed: false, reason: "Aluno não matriculado nesta turma" };
  }

  // 3️⃣ Verifica mensalidade (mês atual)
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const payment = await prisma.monthlyPayment.findFirst({
    where: {
      studentId,
      classId: videoLesson.classId,
      month,
      year,
      status: "PAID",
    },
  });

  if (!payment) {
    return { allowed: false, reason: "Mensalidade em atraso" };
  }

  // ✅ Tudo ok
  return { allowed: true };
}
