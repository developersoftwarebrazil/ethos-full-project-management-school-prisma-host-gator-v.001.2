"use server";

import { ParentSchema } from "@/lib/formValidationSchemas";
import { hashPassword } from "@/lib/passwords";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
type CurrentState = {
  success: boolean;
  error: boolean;
};

/* =========================================================
 * 📕 PARENTS
 * ========================================================= */
export const createParent = async (
  currentState: CurrentState,
  data: ParentSchema
) => {
  try {
    /**
     * ================================
     * 🔁 CLERK (DESATIVADO TEMPORARIAMENTE)
     * ================================
     *
     * const user = await clerkClient.users.createUser({
     *   username: data.username,
     *   password: data.password,
     *   firstName: data.name,
     *   lastName: data.surname,
     *   emailAddress: data.email ? [data.email] : undefined,
     *   publicMetadata: { role: "parent" },
     * });
     */
    
    const parentId = crypto.randomUUID();
    await prisma.parent.create({
      data: {
        // id: user.id, // quando reativar Clerk
        id: parentId, // temporário sem Clerk
        // username: data.username,
        name: data.name,
        surname: data.surname,
        // email: data.email || null,
        phone: data.phone ?? "",
        address: data.address,
        students: {
          connect: data.student?.map((studentId: string) => ({
            id: studentId,
          })),
        },
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("❌ ERRO createParent:", err);
    return { success: false, error: true };
  }
};

// 🟦 Atualizar parent
export const updateParent = async (
  currentState: CurrentState,
  data: ParentSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    /**
     * ================================
     * 🔁 CLERK (DESATIVADO TEMPORARIAMENTE)
     * ================================
     *
     * Quando quiser reativar o Clerk:
     * const user = await clerkClient.users.updateUser(data.id, {
     * username: data.username,
     *  ...(data.password !== "" && { password: data.password }),
     *  firstName: data.name,
     *  lastName: data.surname,
     * });
     */
    await prisma.parent.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        // username: data.username,
        name: data.name,
        surname: data.surname,
        // email: data.email || null,
        phone: data.phone ?? "",
        address: data.address,
        students: {
          set: data.student?.map((studentId: string) => ({
            id: studentId,
          })),
        },
      },
    });
    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
// 🟥 Deletar parent
export const deleteParent = async (
  currentState: CurrentState,
  formData: FormData
) => {
  const id = formData.get("id") as string;

  try {
    /**
     * ================================
     * 🔁 CLERK (DESATIVADO TEMPORARIAMENTE)
     * ================================
     *
     * await clerkClient.users.deleteUser(id);
     */
    await prisma.parent.delete({
      where: { id },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};
