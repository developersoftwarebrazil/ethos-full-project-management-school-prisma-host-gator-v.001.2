import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";

const TeacherVideoLessonsPage = async () => {
  const session = cookies().get("session");
  if (!session) redirect("/login");

  const { id: userId, role } = JSON.parse(session.value);
  if (role !== "teacher") redirect("/unauthorized");

  
  const lessons = await prisma.videoLesson.findMany({
    where: { teacherId: userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      published: true,
      createdAt: true,
    },
  });
  console.log(lessons);
  
  return (
    <div className="bg-white p-4 rounded-md space-y-4">
      <h1 className="text-xl font-semibold">Minhas Vídeo-Aulas</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Título</th>
            <th className="p-2">Status</th>
            <th className="p-2">Criada em</th>
            <th className="p-2">Ações</th>
          </tr>
        </thead>

        <tbody>
          {lessons.map((lesson) => (
            <tr key={lesson.id} className="border-t">
              <td className="p-2">{lesson.title}</td>
              <td className="p-2">
                {lesson.published ? (
                  <span className="text-green-600">Publicada</span>
                ) : (
                  <span className="text-yellow-600">Rascunho</span>
                )}
              </td>
              <td className="p-2">
                {new Date(lesson.createdAt).toLocaleDateString()}
              </td>
              <td className="p-2">
                <Link
                  href={`/teacher/video-lesson/${lesson.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Visualizar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherVideoLessonsPage;


// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
// import prisma from "@/lib/prisma";

// const TeacherVideoLessonsPage = async () => {
//   const session = cookies().get("session");
//   if (!session) redirect("/login");

//   const { id: userId, role } = JSON.parse(session.value);
//   if (role !== "teacher") redirect("/unauthorized");

//   const lessons = await prisma.videoLesson.findMany({
//     where: { teacherId: userId },
//     orderBy: { createdAt: "desc" },
//   });

//   return (
//     <div className="bg-white p-4 rounded-md">
//       <h1 className="text-xl font-semibold">Minhas Vídeo-Aulas</h1>
//       {/* tabela aqui */}
//     </div>
//   );
// };

// export default TeacherVideoLessonsPage;
