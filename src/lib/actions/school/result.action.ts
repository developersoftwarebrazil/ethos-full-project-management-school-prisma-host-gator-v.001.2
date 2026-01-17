"use server"; // ⚠️ depois falamos disso, por enquanto só debug

import prisma from "@/lib/prisma";
import { ResultSchema } from "@/lib/formValidationSchemas";
import { revalidatePath } from "next/cache";

type CurrentState = {
  success: boolean;
  error: boolean;
};

// =======================================================
// 🟩 CREATE RESULT — DEBUG VERSION
// =======================================================
export const createResult = async (
  currentState: CurrentState,
  data: ResultSchema
) => {
  console.log("🟢 [createResult] START ==========================");
  console.log("➡️ currentState:", currentState);
  console.log("📥 raw data:", data);
  console.log("📥 data types:", {
    score: typeof data?.score,
    studentId: typeof data?.studentId,
    examId: typeof data?.examId,
    assignmentId: typeof data?.assignmentId,
  });

  try {
    const score = Number(data.score);

    console.log("🧮 parsed values:", {
      score,
      studentId: data.studentId,
      examId: data.examId ? Number(data.examId) : null,
      assignmentId: data.assignmentId
        ? Number(data.assignmentId)
        : null,
    });

    if (isNaN(score)) {
      throw new Error("Score convertido para NaN");
    }

    console.log("🚀 Calling prisma.result.create");

    const created = await prisma.result.create({
      data: {
        score,
        student: {
          connect: { id: data.studentId },
        },
        ...(data.examId && {
          exam: { connect: { id: Number(data.examId) } },
        }),
        ...(data.assignmentId && {
          assignment: { connect: { id: Number(data.assignmentId) } },
        }),
      },
    });

    console.log("✅ Prisma result created:", created);

    revalidatePath("/list/results");
    console.log("🔄 Path revalidated: /list/results");

    console.log("🟢 [createResult] END ============================");
    return { success: true, error: false };
  } catch (err: any) {
    console.error("❌ [createResult] ERROR ========================");
    console.error("🧨 message:", err?.message);
    console.error("🧨 name:", err?.name);
    console.error("🧨 stack:", err?.stack);

    // Prisma specific (se existir)
    if (err?.code) {
      console.error("🧩 Prisma error code:", err.code);
      console.error("🧩 Prisma meta:", err.meta);
    }

    return { success: false, error: true };
  }
};

// =======================================================
// 🟦 UPDATE RESULT — DEBUG VERSION
// =======================================================
export const updateResult = async (
  currentState: CurrentState,
  data: ResultSchema
) => {
  console.log("🔵 [updateResult] START ==========================");
  console.log("➡️ currentState:", currentState);
  console.log("📥 raw data:", data);

  try {
    if (!data.id) {
      console.error("❌ Missing ID");
      throw new Error("ID é obrigatório para atualizar o resultado");
    }

    const payload = {
      score: Number(data.score),
      studentId: data.studentId,
      examId: data.examId ? Number(data.examId) : null,
      assignmentId: data.assignmentId
        ? Number(data.assignmentId)
        : null,
    };

    console.log("🧮 update payload:", payload);

    if (isNaN(payload.score)) {
      throw new Error("Score convertido para NaN");
    }

    console.log("🚀 Calling prisma.result.update");

    const updated = await prisma.result.update({
      where: { id: data.id },
      data: payload,
    });

    console.log("✅ Prisma result updated:", updated);

    revalidatePath("/list/results");
    console.log("🔄 Path revalidated: /list/results");

    console.log("🔵 [updateResult] END ============================");
    return { success: true, error: false };
  } catch (err: any) {
    console.error("❌ [updateResult] ERROR ========================");
    console.error("🧨 message:", err?.message);
    console.error("🧨 name:", err?.name);
    console.error("🧨 stack:", err?.stack);

    if (err?.code) {
      console.error("🧩 Prisma error code:", err.code);
      console.error("🧩 Prisma meta:", err.meta);
    }

    return { success: false, error: true };
  }
};

// =======================================================
// 🟥 DELETE RESULT — DEBUG VERSION
// =======================================================
export const deleteResult = async (
  currentState: CurrentState,
  data: FormData
) => {
  console.log("🔴 [deleteResult] START ==========================");
  console.log("➡️ currentState:", currentState);

  const rawId = data.get("id");
  const id = Number(rawId);

  console.log("📥 raw id:", rawId, "type:", typeof rawId);
  console.log("🧮 parsed id:", id);

  try {
    if (!id || isNaN(id)) {
      throw new Error("ID inválido para delete");
    }

    console.log("🚀 Calling prisma.result.delete");

    const deleted = await prisma.result.delete({
      where: { id },
    });

    console.log("✅ Prisma result deleted:", deleted);

    console.log("🔴 [deleteResult] END ============================");
    return { success: true, error: false };
  } catch (err: any) {
    console.error("❌ [deleteResult] ERROR ========================");
    console.error("🧨 message:", err?.message);
    console.error("🧨 name:", err?.name);
    console.error("🧨 stack:", err?.stack);

    if (err?.code) {
      console.error("🧩 Prisma error code:", err.code);
      console.error("🧩 Prisma meta:", err.meta);
    }

    return { success: false, error: true };
  }
};





// "use client";

// import prisma from "@/lib/prisma";
// import { ResultSchema } from "@/lib/formValidationSchemas";
// import { revalidatePath } from "next/cache";

// type CurrentState = {
//   success: boolean;
//   error: boolean;
// };

// // 🟩 Criar novo resultado
// export const createResult = async (
//   currentState: CurrentState,
//   data: ResultSchema
// ) => {
//     console.log("🟢 [createResult] START");
//   console.log("➡️ currentState:", currentState);
//   try {
//      // 🔍 RAW FORMDATA
//     console.log("📦 formData entries:");
//     await prisma.result.create({
//       data: {
//         score: Number(data.score),
//         student: {
//           connect: { id: data.studentId },
//         },
//         ...(data.examId && {
//           exam: { connect: { id: Number(data.examId) } },
//         }),
//         ...(data.assignmentId && {
//           assignment: { connect: { id: Number(data.assignmentId) } },
//         }),
//       },
//     });

//     revalidatePath("/list/results");
//     return { success: true, error: false };
//   } catch (err) {
//     console.error("❌ Erro ao criar resultado:", err);
//     return { success: false, error: true };
//   }
// };

// // 🟦 Atualizar resultado
// export const updateResult = async (
//   currentState: CurrentState,
//   data: ResultSchema
// ) => {
//   try {
//     if (!data.id) {
//       throw new Error("ID é obrigatório para atualizar o resultado");
//     }

//     await prisma.result.update({
//       where: { id: data.id },
//       data: {
//         score: Number(data.score),

//         // limpar e definir novamente examId / assignmentId
//         examId: data.examId ? Number(data.examId) : null,
//         assignmentId: data.assignmentId ? Number(data.assignmentId) : null,

//         studentId: data.studentId,
//       },
//     });

//     revalidatePath("/list/results");
//     return { success: true, error: false };
//   } catch (err) {
//     console.error("❌ Erro ao atualizar resultado:", err);
//     return { success: false, error: true };
//   }
// };

// // 🟥 Deletar resultado
// export const deleteResult = async (
//   currentState: CurrentState,
//   data: FormData
// ) => {
//   const id = Number(data.get("id"));

//   try {
//     await prisma.result.delete({
//       where: { id },
//     });

//     return { success: true, error: false };
//   } catch (err) {
//     console.error("❌ Erro ao deletar resultado:", err);
//     return { success: false, error: true };
//   }
// };
