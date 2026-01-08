// src/components/attendance/AttendanceCard.tsx
"use client";

import { useState } from "react";
import AttendanceForm from "@/components/forms/AttendanceForm";
import { useRouter } from "next/navigation";

export default function AttendanceCard({ attendance }: { attendance: any }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="bg-white rounded-md shadow p-4">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h2 className="text-xl font-semibold">
            {attendance.student?.name} {attendance.student?.surname ?? ""}
          </h2>
          <p className="text-sm text-gray-600">
            Aula: {attendance.lesson?.name ?? "-"} • Turma:{" "}
            {attendance.lesson?.class?.name ?? "-"}
          </p>
        </div>

        <div>
          <div className="text-sm text-gray-500">
            {new Date(attendance.date).toLocaleDateString("pt-BR")}
          </div>
          <div className="mt-2">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100">
              {attendance.status}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          className="bg-lamaSky text-white px-3 py-1 rounded"
          onClick={() => setOpen(true)}
        >
          Editar
        </button>

        <button
          className="bg-gray-200 px-3 py-1 rounded"
          onClick={() => router.back()}
        >
          Voltar
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-md p-4 w-[90%] md:w-[60%]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Editar Presença</h3>
              <button
                onClick={() => {
                  setOpen(false);
                  router.refresh();
                }}
              >
                Fechar
              </button>
            </div>

            <AttendanceForm
              type="update"
              data={{
                id: attendance.id,
                lessonId: attendance.lessonId,
                date: attendance.date,
                records: [
                  {
                    studentId: attendance.studentId,
                    status: attendance.status,
                  },
                ],
              }}
              setOpen={(value) => {
                setOpen(value);
                if (value === false) router.refresh();
              }}
              relatedData={{
                students: [
                  {
                    id: attendance.studentId,
                    name: attendance.student?.name,
                    surname: attendance.student?.surname,
                  },
                ],
                lessons: [
                  { id: attendance.lesson?.id, name: attendance.lesson?.name },
                ],
                lesson: attendance.lesson,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
