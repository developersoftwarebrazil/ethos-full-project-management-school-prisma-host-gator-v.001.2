import { Event } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import clsx from "clsx";

// Cores do tema ETHOS
const TYPE_COLORS: Record<string, string> = {
  aula: "bg-ethosGreen text-white",
  prova: "bg-ethosRed text-white",
  aviso: "bg-ethosSky text-white",
  reuniao: "bg-ethosPurple text-white",
  geral: "bg-ethosYellow text-black",
};

// Caso seu evento tenha "type" no banco
// Se não tiver, pode usar event.description para definir tipo automaticamente
const getType = (event: Event) => {
  if ((event as any).type) return (event as any).type;
  return "geral";
};

const EventItem = ({ event }: { event: Event }) => {
  const type = getType(event);
  const color = TYPE_COLORS[type] ?? TYPE_COLORS.outro;

  const isPast = new Date(event.endTime) < new Date();

  return (
    <div
      className={clsx(
        "p-4 rounded-lg border-2 shadow-sm transition flex flex-col gap-2",
        "border-gray-100 bg-white",
        "hover:shadow-md hover:border-ethosSky/40"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-700">{event.title}</h2>

        {/* Ícone do evento */}
        <Image src="/eventDark.png" alt="" width={22} height={22} />
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2">
        <span
          className={clsx(
            "px-2 py-0.5 text-xs rounded-full font-medium capitalize",
            color
          )}
        >
          {type}
        </span>

        {isPast ? (
          <span className="px-2 py-0.5 text-xs rounded-full bg-gray-300 text-gray-700">
            Encerrado
          </span>
        ) : (
          <span className="px-2 py-0.5 text-xs rounded-full bg-green-950/20 text-gray-950">
            Ativo
          </span>
        )}
      </div>

      {/* Datas */}
      <div className="text-xs text-gray-500">
        <p>
          <strong>Início:</strong>{" "}
          {format(event.startTime, "dd MMM yyyy 'às' HH:mm", { locale: ptBR })}
        </p>
        <p>
          <strong>Fim:</strong>{" "}
          {format(event.endTime, "dd MMM yyyy 'às' HH:mm", { locale: ptBR })}
        </p>
      </div>

      {/* Descrição */}
      {event.description && (
        <p className="text-gray-600 text-sm mt-1">{event.description}</p>
      )}
    </div>
  );
};

export default EventItem;
