// src/components/EventCalendarContainer.tsx
import Image from "next/image";
import EventCalendar from "./EventCalendar";
import EventList from "./EventList";

const EventCalendarContainer = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { date, search, mode } = searchParams || {};

  // default para o usuário: FUTURE (modo C)
  const effectiveMode = (mode as "day" | "week" | "future" | "all") ?? "future";

  return (
    <div className="bg-white p-4 rounded-md">
      {/* EventCalendar pode ser client (ex: mini calendar UI). Mantive import direto,
          já que o componente EventCalendar deve ser client se usa browser APIs */}
      <EventCalendar dateParam={date} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">Eventos</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <div className="flex flex-col gap-4">
        {/* Passa search e modo para a lista */}
        {/* mode default: future */}
        {/* EventList é server component e fará a query */}

        <EventList dateParam={date} mode={effectiveMode} search={search} />
      </div>
    </div>
  );
};

export default EventCalendarContainer;
