"use server";

import { AssignmentSchema } from "@/lib/formValidationSchemas";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAuth } from '@/lib/auth';
type CurrentState = {
  success: boolean;
  error: boolean;
};



/* =========================================================
 * 📕 ASSIGNMENTS
 * ========================================================= */
export const createAssignment = async (
  currentState: CurrentState,
  data: AssignmentSchema
) => {
  const user = await requireAuth();
  const userId = user.id;
  const role = user.role;
  /**
   * 🔁 CLERK (DESATIVADO)
   * const { userId, sessionClaims } = auth();
   * const role = (sessionClaims?.metadata as { role?: string })?.role;
   */

  try {
    // Se professor, verificar se a aula pertence ao professor
    if (role === "teacher") {
      const lesson = await prisma.lesson.findUnique({
        where: { id: Number(data.lessonId) },
      });

      if (!lesson || lesson.teacherId !== userId) {
        return { success: false, error: true };
      }
    }

    await prisma.assignment.create({
      data: {
        title: data.title,
        startDate: data.startDate, // validado pelo Zod
        dueDate: data.dueDate, // validado pelo Zod
        lesson: {
          connect: { id: Number(data.lessonId) },
        },
      },
    });

    revalidatePath("/list/assignments");
    return { success: true, error: false };
  } catch (err) {
    console.log("ERRO NO CREATE:", err);
    return { success: false, error: true };
  }
};

// 🟦 Atualizar assignment
export const updateAssignment = async (
  currentState: CurrentState,
  data: AssignmentSchema
) => {
  const user = await requireAuth();
  const userId = user.id;
  const role = user.role;

  /**
   * 🔁 CLERK (DESATIVADO)
   * const { userId, sessionClaims } = auth();
   * const role = (sessionClaims?.metadata as { role?: string })?.role;
   */

  try {
    // Se professor, garantir que ele é dono da aula
    if (role === "teacher") {
      const lesson = await prisma.lesson.findUnique({
        where: { id: Number(data.lessonId) },
      });

      if (!lesson || lesson.teacherId !== userId) {
        return { success: false, error: true };
      }
    }

    await prisma.assignment.update({
      where: { id: Number(data.id) },
      data: {
        title: data.title,
        startDate: data.startDate,
        dueDate: data.dueDate,
        lesson: {
          connect: { id: Number(data.lessonId) },
        },
      },
    });

    revalidatePath("/list/assignments");
    return { success: true, error: false };
  } catch (err) {
    console.log("ERRO NO UPDATE:", err);
    return { success: false, error: true };
  }
};
// 🟥 Deletar assignment
export const deleteAssignment = async (
  currentState: CurrentState,
  formData: FormData
) => {
  const id = Number(formData.get("id"));

  try {
    await prisma.assignment.delete({
      where: { id },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};