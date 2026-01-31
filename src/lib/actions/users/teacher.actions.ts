"use server";

import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/passwords";
import { TeacherSchema } from "@/lib/formValidationSchemas";

type CurrentState = { success: boolean; error: boolean };

export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  try {
    const hashedPassword = data.password
      ? await hashPassword(data.password)
      : "";

    const user = await prisma.user.create({
      data: {
        username: data.username,
        name: data.name,
        password: hashedPassword,
        role: "teacher",
      },
    });

    await prisma.teacher.create({
      data: {
        id: user.id,
        // username: data.username,
        name: data.name,
        surname: data.surname,
        // email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          connect: data.subjects?.map((id) => ({
            id: parseInt(id),
          })),
        },
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("❌ createTeacher:", err);
    return { success: false, error: true };
  }
};
export const updateTeacher = async (
  _currentState: CurrentState,
  data: TeacherSchema
) => {
  if (!data.id) return { success: false, error: true };

  try {
    /**
     * =====================================================
     * 🔐 UPDATE USER (username / password OPCIONAIS)
     * =====================================================
     */
    const userUpdateData: any = {};

    if (data.username?.trim()) {
      userUpdateData.username = data.username;
    }

    if (data.password?.trim()) {
      userUpdateData.password = await hashPassword(data.password);
    }

    if (Object.keys(userUpdateData).length > 0) {
      await prisma.user.update({
        where: { id: data.id },
        data: userUpdateData,
      });
    }

    /**
     * =====================================================
     * 👨‍🏫 UPDATE TEACHER (SEM username / email)
     * =====================================================
     */
    const teacherUpdateData: any = {
      name: data.name,
      surname: data.surname,
      phone: data.phone || null,
      address: data.address,
      bloodType: data.bloodType,
      sex: data.sex,
      birthday: data.birthday || null,
    };

    if (data.img !== undefined) {
      teacherUpdateData.img = data.img;
    }

    if (data.subjects) {
      teacherUpdateData.subjects = {
        set: data.subjects.map((id) => ({
          id: parseInt(id),
        })),
      };
    }

    await prisma.teacher.update({
      where: { id: data.id },
      data: teacherUpdateData,
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("❌ updateTeacher:", err);
    return { success: false, error: true };
  }
};


// export const updateTeacher = async (
//   currentState: CurrentState,
//   data: TeacherSchema
// ) => {
//   if (!data.id) return { success: false, error: true };

//   try {
//     const userUpdateData: any = {
//       username: data.username,
//     };

//     if (data.password?.trim()) {
//       userUpdateData.password = await hashPassword(data.password);
//     }

//     await prisma.user.update({
//       where: { id: data.id },
//       data: userUpdateData,
//     });

//     const teacherUpdateData: any = {
//       username: data.username,
//       name: data.name,
//       surname: data.surname,
//       email: data.email || null,
//       phone: data.phone || null,
//       address: data.address,
//       bloodType: data.bloodType,
//       sex: data.sex,
//       birthday: data.birthday,
//     };

//     if (data.img !== undefined) {
//       teacherUpdateData.img = data.img;
//     }

//     if (data.subjects) {
//       teacherUpdateData.subjects = {
//         set: data.subjects.map((id) => ({
//           id: parseInt(id),
//         })),
//       };
//     }

//     await prisma.teacher.update({
//       where: { id: data.id },
//       data: teacherUpdateData,
//     });

//     return { success: true, error: false };
//   } catch (err) {
//     console.error("❌ updateTeacher:", err);
//     return { success: false, error: true };
//   }
// };

// export const deleteTeacher = async (
//   currentState: CurrentState,
//   data: FormData
// ) => {
//   const id = data.get("id") as string;
//   if (!id) return { success: false, error: true };

//   try {
//     await prisma.teacher.update({
//       where: { id },
//       data: { subjects: { set: [] } },
//     });

//     await prisma.teacher.delete({ where: { id } });
//     await prisma.user.delete({ where: { id } });

//     return { success: true, error: false };
//   } catch (err) {
//     console.error("❌ deleteTeacher:", err);
//     return { success: false, error: true };
//   }
// };

// export const deleteTeacher = async (
//   _currentState: CurrentState,
//   data: FormData
// ) => {
//   const id = data.get("id");
//   if (typeof id !== "string" || !id) {
//     return { success: false, error: true };
//   }

//   try {
//     const teacher = await prisma.teacher.findUnique({
//       where: { id },
//       select: { id: true },
//     });

//     if (!teacher) {
//       return { success: false, error: true };
//     }

//     // remove relações N:N
//     await prisma.teacher.update({
//       where: { id },
//       data: { subjects: { set: [] } },
//     });

//     // delete teacher
//     await prisma.teacher.delete({ where: { id } });

//     // delete user relacionado (se existir)
//     if (teacher.id) {
//       await prisma.user.delete({
//         where: { id: teacher.id },
//       });
//     }

//     return { success: true, error: false };
//   } catch (err) {
//     console.error("❌ deleteTeacher:", err);
//     return { success: false, error: true };
//   }
// };



// export const deleteTeacher = async (
//   currentState: CurrentState,
//   data: FormData
// ) => {
//   /**
//    * =====================================================
//    * 📌 ID DO USUÁRIO / PROFESSOR
//    * =====================================================
//    * No sistema local:
//    * - User.id === Teacher.id
//    */
//   const id = data.get("id") as string;

//   if (!id) {
//     return { success: false, error: true };
//   }

//   try {
//     /**
//      * =====================================================
//      * 🔐 AUTH LOCAL (ATIVO)
//      * =====================================================
//      * Ordem IMPORTANTE:
//      * 1) Deletar entidades dependentes
//      * 2) Deletar Teacher
//      * 3) Deletar User
//      */

//     /**
//      * 1️⃣ Remove relações (subjects)
//      * Evita erro de FK
//      */
//     await prisma.teacher.update({
//       where: { id },
//       data: {
//         subjects: {
//           set: [],
//         },
//       },
//     });

//     /**
//      * 2️⃣ Deleta o TEACHER
//      */
//     await prisma.teacher.delete({
//       where: { id },
//     });

//     /**
//      * 3️⃣ Deleta o USER (auth local)
//      */
//     await prisma.user.delete({
//       where: { id },
//     });

//     /**
//      * =====================================================
//      * 🔁 CLERK (DESATIVADO TEMPORARIAMENTE)
//      * =====================================================
//      * Quando reativar o Clerk:
//      *
//      * ⚠️ ATENÇÃO:
//      * - NÃO use User.id diretamente se não for o clerkId
//      * - O ideal é armazenar clerkId separado no User
//      */
//     /*
//     await clerkClient.users.deleteUser(id);
//     */

//     // revalidatePath("/list/teachers");
//     return { success: true, error: false };
//   } catch (err) {
//     console.error(err);
//     return { success: false, error: true };
//   }
// };

export async function deleteTeacher(
  _state: any,
  data: FormData
) {
  const id = data.get("id") as string;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.lesson.deleteMany({
        where: { teacherId: id },
      });

      await tx.teacher.delete({
        where: { id },
      });

      await tx.user.delete({
        where: { id },
      });
    });

    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
}
