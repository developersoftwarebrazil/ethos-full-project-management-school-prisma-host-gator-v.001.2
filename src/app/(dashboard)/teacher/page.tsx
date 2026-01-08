/**
 * ================================
 * 🔁 CLERK (DESATIVADO TEMPORARIAMENTE)
 * ================================
 */
// import { auth } from "@clerk/nextjs/server";

import Announcements from "@/components/dashboards/announcements/Announcements";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BigCalendarContainer = dynamic(
  () => import("@/components/dashboards/calendar/BigCalendarContainer"),
  { ssr: false }
);

const TeacherPage = () => {
  /**
   * ================================
   * 🔐 AUTH LOCAL (SERVER)
   * ================================
   */
  const cookieStore = cookies();
  const session = cookieStore.get("session");

  if (!session) {
    redirect("/login");
  }

  let parsed;
  try {
    parsed = JSON.parse(session.value);
  } catch {
    redirect("/login");
  }

  const { id: userId, role } = parsed;

  // ❗ PROTEÇÃO DE ROLE
  if (role !== "teacher") {
    redirect("/unauthorized");
  }

  /**
   * ================================
   * 🔁 CLERK (REFERÊNCIA FUTURA)
   * ================================
   */
  // const { userId } = auth();

  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Agenda</h1>
          <BigCalendarContainer type="teacherId" id={userId} />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcements />
      </div>
    </div>
  );
};

export default TeacherPage;
