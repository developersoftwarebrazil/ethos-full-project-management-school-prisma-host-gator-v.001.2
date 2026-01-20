"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { deleteAttendance } from "@/lib/actions/index";
import AttendanceForm from "@/components/forms/AttendanceForm";
import Link from "next/link";

// ---------------- BADGE ---------------- //
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PRESENT: "bg-green-100 text-green-800",
    ABSENT: "bg-red-100 text-red-800",
    LATE: "bg-yellow-100 text-yellow-800",
    JUSTIFIED: "bg-sky-100 text-sky-800",
    EXCUSED: "bg-purple-100 text-purple-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        map[status] ?? "bg-gray-100 text-gray-800"
      }`}
    >
      {status === "PRESENT"
        ? "Presente"
        : status === "ABSENT"
        ? "Faltou"
        : status === "LATE"
        ? "Atrasado"
        : status === "JUSTIFIED"
        ? "Justificado"
        : status === "EXCUSED"
        ? "Dispensado"
        : status}
    </span>
  );
}

// ---------------- TABLE ---------------- //
export default function AttendanceTable({
  attendances,
  students,
  lessons,
}: {
  attendances: any[];
  students?: any[];
  lessons?: any[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  // Estado seguro para delete
  type DeleteState = { success: boolean; error?: string | null };

  const initialDeleteState: DeleteState = {
    success: false,
    error: null,
  };

  // useFormState EXIGE que o wrapper tenha esse formato
  const deleteWrapper = async (
    _state: DeleteState,
    formData: FormData
  ): Promise<DeleteState> => {
    const res = await deleteAttendance({ success: false, error: false }, formData);

    return {
      success: false,
      error: "Erro ao deletar presença.",
    };
  };

  const [deleteState, deleteAction] = useFormState(
    deleteWrapper,
    initialDeleteState
  );

  if (deleteState.success) router.refresh();

  return (
    <div className="bg-white rounded-md shadow-sm p-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm table-auto">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Aluno</th>
              <th className="py-2">Aula</th>
              <th className="py-2">Turma</th>
              <th className="py-2">Data</th>
              <th className="py-2">Status</th>
              <th className="py-2">Ações</th>
            </tr>
          </thead>

          <tbody>
            {attendances.map((a) => (
              <tr key={a.id} className="border-b">
                <td className="py-3">{a.student?.name} {a.student?.surname}</td>
                <td className="py-3">{a.lesson?.name}</td>
                <td className="py-3">{a.lesson?.class?.name ?? "-"}</td>
                <td className="py-3">
                  {new Date(a.date).toLocaleDateString("pt-BR")}
                </td>

                <td className="py-3">
                  <StatusBadge status={a.status} />
                </td>

                <td className="py-3">
                  <div className="flex items-center gap-2">

                    {/* EDITAR */}
                    <button
                      className="text-sm bg-lamaSky px-2 py-1 rounded text-white"
                      onClick={() => {
                        setEditing(a);
                        setOpen(true);
                      }}
                    >
                      Editar
                    </button>

                    {/* DELETE */}
                    <form action={deleteAction} method="post">
                      <input type="hidden" name="id" value={a.id} />
                      <button
                        type="submit"
                        className="text-sm bg-red-600 px-2 py-1 rounded text-white"
                      >
                        Deletar
                      </button>
                    </form>

                    <Link
                      href={`/list/attendance/${a.id}`}
                      className="text-sm bg-gray-200 px-2 py-1 rounded"
                    >
                      Ver
                    </Link>
                  </div>
                </td>
              </tr>
            ))}

            {attendances.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-500">
                  Nenhuma presença encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {open && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-md p-4 w-[90%] md:w-[60%]">

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Editar Presença</h3>

              <button
                onClick={() => {
                  setOpen(false);
                  setEditing(null);
                }}
              >
                Fechar
              </button>
            </div>

            <AttendanceForm
              type="update"
              data={{
                id: editing.id,
                lessonId: editing.lessonId,
                date: editing.date,
                records: [
                  {
                    studentId: editing.studentId,
                    status: editing.status,
                  },
                ],
              }}
              setOpen={(val) => {
                setOpen(val);
                if (!val) {
                  setEditing(null);
                  router.refresh();
                }
              }}
              relatedData={{
                students: students ?? [],
                lessons: lessons ?? [],
                lesson: editing.lesson,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
