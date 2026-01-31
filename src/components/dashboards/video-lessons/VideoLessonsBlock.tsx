import Link from "next/link";

type VideoLessonItem = {
  id: string;
  title: string;
  subject: { name: string };
  teacher?: { name: string; surname: string };
};

type Props = {
  title: string;
  lessons: VideoLessonItem[];
  role: "teacher" | "student";
};

export default function VideoLessonsBlock({ title, lessons, role }: Props) {
  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">{title}</h1>

        <Link
          href={`/${role}/video-lessons`}
          className="text-sm text-ethosPurple font-medium"
        >
          Ver todas →
        </Link>
      </div>

      {lessons.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhuma videoaula disponível.</p>
      ) : (
        <ul className="space-y-3">
          {lessons.map((lesson) => (
            <li
              key={lesson.id}
              className="flex justify-between items-center p-3 rounded-md bg-slate-50 hover:bg-ethosPurpleLight"
            >
              <div>
                <p className="font-medium">{lesson.title}</p>
                <p className="text-xs text-gray-500">
                  {lesson.subject.name}
                  {lesson.teacher &&
                    ` • ${lesson.teacher.name} ${lesson.teacher.surname}`}
                </p>
              </div>

              <Link
                href={`/${role}/video-lessons/${lesson.id}`}
                className="text-xs px-3 py-1 rounded-full bg-ethosSky"
              >
                {role === "teacher" ? "Gerenciar" : "Assistir"}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
