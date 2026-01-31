import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

const TeacherVideoLessonsPage = async () => {
  const session = cookies().get("session");
  if (!session) redirect("/login");

  const { id: userId, role } = JSON.parse(session.value);
  if (role !== "teacher") redirect("/unauthorized");

  const lessons = await prisma.videoLesson.findMany({
    where: { teacherId: userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-white p-4 rounded-md">
      <h1 className="text-xl font-semibold">Minhas Vídeo-Aulas</h1>
      {/* tabela aqui */}
    </div>
  );
};

export default TeacherVideoLessonsPage;
