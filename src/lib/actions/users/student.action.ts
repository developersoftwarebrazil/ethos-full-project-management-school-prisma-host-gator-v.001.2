"use server";

import { StudentSchema } from "@/lib/formValidationSchemas";
import { hashPassword } from "@/lib/passwords";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
type CurrentState = {
  success: boolean;
  error: boolean;
};

/* =========================================================
 * 📕 STUDENTS
 * ========================================================= */

export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema,
) => {
  console.log(data);
  try {
    /**
     * =====================================================
     * 🧠 REGRA DE NEGÓCIO
     * Verifica capacidade da turma
     * =====================================================
     */
    const classItem = await prisma.class.findUnique({
      where: { id: Number(data.classId) },
      include: { _count: { select: { students: true } } },
    });

    if (classItem && classItem.capacity === classItem._count.students) {
      return { success: false, error: true };
    }
    /**
     * =====================================================
     * 🔐 AUTH LOCAL (ATIVO)
     * =====================================================
     * Criamos PRIMEIRO o User local
     * O ID gerado será reutilizado no Student
     */
    const hashedPassword = data.password
      ? await hashPassword(data.password)
      : "";
    const user = await prisma.user.create({
      data: {
        username: data.username,
        name: data.name,
        password: hashedPassword, // garantir string
        role: "student",
      },
      select: { id: true },
    });
    /**
     * =====================================================
     * 🔁 CLERK (DESATIVADO)
     * =====================================================
     * Quando reativar:
     *
     * const user = await clerkClient.users.createUser({
     * username: data.username,
     * password: data.password,
     * firstName: data.name,
     * lastName: data.surname,
     + emailAddress: data.email ? [data.email] : undefined,
     * publicMetadata: { role: "student" },
    *});
    */
    /**
     * =====================================================
     * 👨‍🎓 CREATE STUDENT
     * =====================================================
     */

    await prisma.student.create({
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
        birthday: new Date(data.birthday), // FIX 1
        gradeId: Number(data.gradeId), // FIX 2
        classId: Number(data.classId), // FIX 3
        parentId: String(data.parentId), // FIX 4
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log("❌ ERRO createStudent:", err);
    return { success: false, error: true };
  }
};

export const updateStudent = async (
  currentState: CurrentState,
  data: StudentSchema,
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    /**
     * =====================================================
     * 🔐 AUTH LOCAL (ATIVO)
     * Atualiza dados do User
     * =====================================================
     */
    await prisma.user.update({
      where: { id: data.id },
      data: {
        username: data.username,
        ...(data.password !== "" && { password: data.password }),
      },
    });

    /**
     * =====================================================
     * 🔁 CLERK (DESATIVADO)
     *
     * const user = await clerkClient.users.updateUser(data.id, {
     * username: data.username,
     *   ...(data.password !== "" && { password: data.password }),
     * firstName: data.name,
     * lastName: data.surname,
     *});
     */

    await prisma.student.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
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
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });
    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData,
) => {
  const id = data.get("id") as string;
  try {
    /**
     * =====================================================
     * 🔁 CLERK (DESATIVADO)
     * =====================================================
     *await clerkClient.users.deleteUser(id);
     */

    /**
     * =====================================================
     * 🔐 AUTH LOCAL (ATIVO)
     * Ordem correta:
     * 1) Student
     * 2) User
     * =====================================================
     */
    await prisma.student.delete({
      where: {
        id: id,
      },
    });
    await prisma.user.delete({
      where: { id: id },
    });

    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
