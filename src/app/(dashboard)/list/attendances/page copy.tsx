// src/app/list/attendance/page.tsx
import prisma from "@/lib/prisma";
import AttendanceTable from "@/components/AttendanceTable";

export const revalidate = 0;

export default async function AttendanceListPage() {
  const attendances = await prisma.attendance.findMany({
    orderBy: { date: "desc" },
    take: 200,
    include: {
      student: { select: { id: true, name: true, surname: true } },
      lesson: {
        select: {
          id: true,
          name: true,
          startTime: true,
          class: { select: { id: true, name: true } },
          teacherId: true,
        },
      },
    },
  });

  // also pass students/lessons if you want the form to create fast (optional)
  const students = await prisma.student.findMany({
    select: { id: true, name: true, surname: true },
  });

  const lessons = await prisma.lesson.findMany({
    select: { id: true, name: true, startTime: true },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Presenças</h1>

      <AttendanceTable
        attendances={attendances}
        students={students}
        lessons={lessons}
      />
    </div>
  );
}
