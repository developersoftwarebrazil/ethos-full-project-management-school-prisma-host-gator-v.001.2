// src/app/list/attendance/[id]/page.tsx
import prisma from "@/lib/prisma";
import AttendanceCard from "@/components/AttendanceCard";

type Props = { params: { id: string } };

export default async function AttendanceSinglePage({ params }: Props) {
  const id = Number(params.id);

  const attendance = await prisma.attendance.findUnique({
    where: { id },
    include: {
      student: { select: { id: true, name: true, surname: true, email: true } },
      lesson: {
        select: {
          id: true,
          name: true,
          startTime: true,
          class: { select: { id: true, name: true } },
        },
      },
    },
  });

  if (!attendance) {
    return <div className="p-6">Registro de presença não encontrado.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Detalhes da Presença</h1>
      {/* AttendanceCard é client — render will hydrate it */}
      <AttendanceCard attendance={attendance} />
    </div>
  );
}
