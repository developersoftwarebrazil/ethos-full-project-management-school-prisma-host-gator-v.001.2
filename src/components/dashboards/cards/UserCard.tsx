import prisma from "@/lib/prisma";
import Image from "next/image";
import { clerkClient } from "@clerk/nextjs/server";

const typeLabels = { 
  admin: "Administradores",
  teacher: "Professores",
  student: "Alunos",
  parent: "Responsáveis",
};

const UserCard = async ({ type }: {
  type: "admin" | "teacher" | "student" | "parent";
}) => {

  let data = 0;

  // ADMIN VIA CLERK
  if (type === "admin") {
    const users = await clerkClient.users.getUserList();
    data = users.data.filter(
      (u) => u.publicMetadata.role === "admin"
    ).length;
  }

  // PRISMA: TEACHER
  if (type === "teacher") {
    data = await prisma.teacher.count();
  }

  // PRISMA: STUDENT
  if (type === "student") {
    data = await prisma.student.count();
  }

  // PRISMA: PARENT
  if (type === "parent") {
    data = await prisma.parent.count();
  }

  return (
    <div className="rounded-2xl odd:bg-ethosPurple even:bg-ethosYellow p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          {new Date().getFullYear()}/{(new Date().getFullYear() + 1).toString().slice(-2)}
        </span>
        <Image src="/more.png" alt="" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">{data}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">{typeLabels[type]}</h2>
    </div>
  );
};

export default UserCard;
