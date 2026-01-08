/**
 * ================================
 * 🔁 CLERK (DESATIVADO TEMPORARIAMENTE)
 * Quando voltar a usar Clerk:
 * 1) Descomente o import abaixo
 * 2) Use auth() no lugar da lógica de cookies
 * ================================
 */
// import { auth } from "@clerk/nextjs/server";

import Announcements from "@/components/dashboards/announcements/Announcements";
import prisma from "@/lib/prisma";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";

const BigCalendarContainer = dynamic(
  () => import("@/components/dashboards/calendar/BigCalendarContainer"),
  { ssr: false }
);

const ParentPage = async () => {
  /**
   * ================================
   * 🔐 AUTH LOCAL (SEM CLERK)
   * ================================
   */
  const cookieStore = cookies();
  const session = cookieStore.get("session");

  let userId: string | null = null;

  if (session) {
    try {
      const parsed = JSON.parse(session.value);
      userId = parsed.id ?? null;
    } catch {
      userId = null;
    }
  }

  // Usuário não autenticado
  if (!userId) return null;

  /**
   * ================================
   * 🔁 CLERK (REFERÊNCIA FUTURA)
   * ================================
   */
  // const { userId } = auth();

  /**
   * ================================
   * 👨‍👩‍👧 BUSCA DOS ALUNOS DO RESPONSÁVEL
   * ================================
   */
  const students = await prisma.student.findMany({
    where: {
      parentId: userId,
    },
    include: {
      class: true,
    },
  });

  // Responsável sem alunos vinculados
  if (students.length === 0) return null;

  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="flex flex-col gap-4 w-full xl:w-2/3">
        {students.map((student) => (
          <div key={student.id} className="bg-white p-4 rounded-md">
            <h1 className="text-xl font-semibold">
              Agenda ({student.name} {student.surname})
            </h1>

            {student.classId && (
              <BigCalendarContainer type="classId" id={student.classId} />
            )}
          </div>
        ))}
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcements />
      </div>
    </div>
  );
};

export default ParentPage;
