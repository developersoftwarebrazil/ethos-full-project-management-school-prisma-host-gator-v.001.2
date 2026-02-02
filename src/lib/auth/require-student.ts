// src/lib/auth/require-student.ts
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function requireStudent() {
  const session = cookies().get("session");

  if (!session) {
    throw new Error("Not authenticated");
  }

  const { userId, role } = JSON.parse(session.value);

  if (role !== "student") {
    throw new Error("Not a student");
  }

  const student = await prisma.student.findUnique({
    where: { userId },
  });

  if (!student) {
    throw new Error("Student not linked");
  }

  return student;
}
