// src/app/api/student/video-lessons/route.ts
import { NextResponse } from "next/server";
import { requireStudent } from "@/lib/auth/require-student";
import prisma from "@/lib/prisma";

export async function GET() {
  // 🔐 Student autenticado (já validado)
  const student = await requireStudent();

  // 📅 Usa UTC para evitar bug de virada de mês
  const now = new Date();
  const month = now.getUTCMonth() + 1;
  const year = now.getUTCFullYear();

  // 💰 Verifica pagamento mensal
  const payment = await prisma.monthlyPayment.findFirst({
    where: {
      studentId: student.id,
      classId: student.classId,
      month,
      year,
      status: "PAID",
    },
  });

  if (!payment) {
    return NextResponse.json(
      { error: "Payment required" },
      { status: 402 }
    );
  }

  // 🎥 Busca aulas liberadas para a turma do aluno
  const lessons = await prisma.videoLesson.findMany({
    where: {
      published: true,
      isActive: true,
      classId: student.classId,
    },
    orderBy: { createdAt: "desc" },
    include: {
      subject: true,
      teacher: {
        select: {
          name: true,
          surname: true,
        },
      },
    },
  });

  return NextResponse.json(lessons);
}
