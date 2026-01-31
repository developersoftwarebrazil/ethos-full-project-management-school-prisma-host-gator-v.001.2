import Announcements from "@/components/dashboards/announcements/Announcements";
import VideoLessonsBlock from "@/components/dashboards/video-lessons/VideoLessonsBlock";
import prisma from "@/lib/prisma";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BigCalendarContainer = dynamic(
  () => import("@/components/dashboards/calendar/BigCalendarContainer"),
  { ssr: false },
);

const StudentPage = async () => {
  /**
   * ================================
   * 🔐 AUTH LOCAL
   * ================================
   */
  const cookieStore = cookies();
  const session = cookieStore.get("session");

  if (!session) redirect("/login");

  let parsed;
  try {
    parsed = JSON.parse(session.value);
  } catch {
    redirect("/login");
  }

  const { id: userId, role } = parsed;

  if (role !== "student") {
    redirect("/unauthorized");
  }

  /**
   * ================================
   * 🎥 VIDEOAULAS DO ALUNO
   * ================================
   * Regra comum:
   * - aulas da turma do aluno
   */
  const student = await prisma.student.findFirst({
    where: { userId },
    select: { classId: true },
  });

  if (!student) redirect("/unauthorized");

  const videoLessons = await prisma.videoLesson.findMany({
    where: {
      classId: student.classId,
    },
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      subject: true,
      teacher: true,
    },
  });

  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Minha Agenda</h1>
          <BigCalendarContainer type="classId" id={student.classId} />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <VideoLessonsBlock
          title="Últimas Videoaulas"
          lessons={videoLessons}
          role="student"
        />
        <Announcements />
      </div>
    </div>
  );
};

export default StudentPage;
