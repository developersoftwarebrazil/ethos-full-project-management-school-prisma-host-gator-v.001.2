// src/app/api/student/video-lessons/route.ts
import { NextResponse } from "next/server";
import { requireStudent } from "@/lib/auth/require-student";
import prisma from "@/lib/prisma";


export async function GET() {
  const user = await requireStudent();

  // 🔒 user precisa estar vinculado a um Student
  if (!user.studentId) {
    return NextResponse.json(
      { error: "Student not linked to user" },
      { status: 403 }
    );
  }

  const student = await prisma.student.findUnique({
    where: { id: user.studentId },
    select: { classId: true },
  });

  if (!student) {
    return NextResponse.json(
      { error: "Student not found" },
      { status: 404 }
    );
  }

  // 📅 Usa UTC para evitar bug de virada de mês
  const now = new Date();
  const month = now.getUTCMonth() + 1;
  const year = now.getUTCFullYear();

  // 💰 Verifica pagamento mensal
  const payment = await prisma.monthlyPayment.findFirst({
    where: {
      studentId: user.studentId,
      classId: student.classId,
      month,
      year,
      status: "PAID", // enum PaymentStatus
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
        select: { name: true, surname: true },
      },
    },
  });

  return NextResponse.json(lessons);
}

