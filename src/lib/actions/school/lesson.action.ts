"use server";

import { LessonSchema } from "@/lib/formValidationSchemas";
import { hashPassword } from "@/lib/passwords";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
type CurrentState = {
  success: boolean;
  error: boolean;
};


/* =========================================================
 * 📕 LESSONS
 * ========================================================= */
export async function createLesson(data: any) {
  try {
    // converte "07:00" em um objeto Date válido no formato ISO
    const startTime = new Date(`1970-01-01T${data.startTime}:00Z`);
    const endTime = new Date(`1970-01-01T${data.endTime}:00Z`);

    await prisma.lesson.create({
      data: {
        name: data.name,
        subjectId: Number(data.subjectId),
        teacherId: data.teacherId,
        classId: Number(data.classId),
        day: data.day,
        startTime,
        endTime,
      },
    });

    revalidatePath("/list/subjects"); // opcional, se quiser revalidar
    return { success: true, error: false };
  } catch (err) {
    console.error("Erro ao criar aula:", err);
    return { success: false, error: true };
  }
}

export async function updateLesson(data: any) {
  try {
    await prisma.lesson.update({
      where: { id: Number(data.id) },
      data: {
        name: data.name,
        subjectId: Number(data.subjectId),
        teacherId: data.teacherId,
        // gradeId: Number(data.gradeId), // caso queira ativar depois
        classId: Number(data.classId),
        day: data.day,
        startTime: new Date(`1970-01-01T${data.startTime}:00Z`),
        endTime: new Date(`1970-01-01T${data.endTime}:00Z`),
      },
    });

    revalidatePath("/list/subjects"); // revalida cache se necessário
    return { success: true, error: false };
  } catch (err) {
    console.error("Erro ao atualizar aula:", err);
    return { success: false, error: true };
  }
}

// 🟥 Deletar lesson
export const deleteLesson = async (
  currentState: CurrentState,
  formData: FormData
) => {
  const id = Number(formData.get("id"));

  try {
    await prisma.lesson.delete({
      where: { id },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};