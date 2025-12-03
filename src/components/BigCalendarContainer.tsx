// src/components/BigCalendarContainer.tsx
import dynamic from "next/dynamic";
import prisma from "@/lib/prisma";
import { adjustScheduleToCurrentWeek } from "@/lib/utils";

// carrega o componente cliente (BigCalender / BigCalendar) sem SSR para evitar hydration errors
const BigCalendar = dynamic(() => import("./BigCalender"), { ssr: false });

const BigCalendarContainer = async ({
  type,
  id,
}: {
  type: "teacherId" | "classId";
  id: string | number;
}) => {
  // buscar lessons (aulas)
  const lessons = await prisma.lesson.findMany({
    where: {
      ...(type === "teacherId" ? { teacherId: id as string } : { classId: id as number }),
    },
  });

  const lessonEvents = lessons.map((lesson) => ({
    title: lesson.name,
    start: lesson.startTime,
    end: lesson.endTime,
    // opcional: color, resource, allDay, etc
  }));

  // buscar eventos futuros (ou todos, ajuste se quiser)
  const events = await prisma.event.findMany({
    where: { startTime: { gte: new Date() } }, // futuros
    orderBy: { startTime: "asc" },
  });

  const eventMapped = events.map((ev) => ({
    title: ev.title,
    start: ev.startTime,
    end: ev.endTime,
    // you can add extra fields to show in event tooltip
  }));

  // Mescla aulas + eventos
  const calendarData = [...lessonEvents, ...eventMapped];

  // Ajuste de agenda (se quiser manter schedule ajustado para semana atual)
  const schedule = adjustScheduleToCurrentWeek(calendarData);

  return (
    <div className="h-[650px]">
      {/* BigCalendar é client-only (ssr: false) */}
      <BigCalendar data={schedule} />
    </div>
  );
};

export default BigCalendarContainer;
