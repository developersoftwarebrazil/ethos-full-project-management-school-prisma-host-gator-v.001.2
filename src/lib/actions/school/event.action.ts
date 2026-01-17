"use server"; // ⚠️ depois falamos disso, por enquanto só debug

import prisma from "@/lib/prisma";
import { EventSchema } from "@/lib/formValidationSchemas";
import { revalidatePath } from "next/cache";

type CurrentState = {
  success: boolean;
  error: boolean;
};

// =======================================================
// 🟩  EVENT
// =======================================================

export const createEvent = async (
  currentState: { success: boolean; error: boolean },
  data: EventSchema,
) => {
  try {
    await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        classId: data.classId ? Number(data.classId) : null,
      },
    });

    // revalidatePath("/list/events");
    return { success: true, error: false };
  } catch (err) {
    console.error("❌ Erro ao criar evento:", err);
    return { success: false, error: true };
  }
};
// 🟦 Atualizar evento
export const updateEvent = async (
  currentState: { success: boolean; error: boolean },
  data: EventSchema,
) => {
  try {
    await prisma.event.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        classId: data.classId ? Number(data.classId) : null,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("❌ Erro ao atualizar evento:", err);
    return { success: false, error: true };
  }
};

// 🟥 Deletar evento
export const deleteEvent = async (
  currentState: { success: boolean; error: boolean },
  formData: FormData,
) => {
  const id = Number(formData.get("id"));

  try {
    await prisma.event.delete({
      where: { id },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("❌ Erro ao deletar evento:", err);
    return { success: false, error: true };
  }
};
