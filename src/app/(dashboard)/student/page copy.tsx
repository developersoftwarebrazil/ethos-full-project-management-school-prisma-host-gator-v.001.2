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
import EventCalendar from "@/components/dashboards/calendar/EventCalendar";
import prisma from "@/lib/prisma";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BigCalendarContainer = dynamic(
  () => import("@/components/dashboards/calendar/BigCalendarContainer"),
  { ssr: false }
);

const StudentPage = async () => {
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
      userId = parsed.userId ?? null; // 🔥 correção importante
    } catch {
      userId = null;
    }
  }

  // 🔒 NÃO autenticado → login
  if (!userId) {
    redirect("/login");
  }

  /**
   * ================================
   * 🔁 CLERK (REFERÊNCIA FUTURA)
   * ================================
   */
  // const { userId } = auth();
  // if (!userId) redirect("/login");

  /**
   * ================================
   * 📚 BUSCA DA TURMA DO ALUNO
   * ================================
   */
  const classItem = await prisma.class.findFirst({
    where: {
      students: {
        some: { id: userId },
      },
    },
  });

  /**
   * ⚠️ ALUNO SEM TURMA
   * NÃO renderiza página em branco
   */
  if (!classItem) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-md p-6 shadow">
          <h1 className="text-xl font-semibold text-red-500">
            Nenhuma turma encontrada
          </h1>
          <p className="text-gray-500 mt-2">
            Você ainda não está vinculado a nenhuma turma.
            <br />
            Entre em contato com a coordenação.
          </p>
        </div>
      </div>
    );
  }

  /**
   * ================================
   * ✅ DASHBOARD NORMAL
   * ================================
   */
  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Agenda ({classItem.name})</h1>

          <BigCalendarContainer type="classId" id={classItem.id} />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default StudentPage;
