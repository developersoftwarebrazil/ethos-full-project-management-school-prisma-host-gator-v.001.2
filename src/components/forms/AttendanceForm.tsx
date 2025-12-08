"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  AttendanceSchema,
  attendanceSchema,
} from "@/lib/formValidationSchemas";
import {
  createAttendance,
  updateAttendance,
} from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AttendanceForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AttendanceSchema>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      lessonId: data?.lessonId ?? "",
      date: data?.date ?? "",
      records: data?.records ?? [],
    },
  });

  // ---------------------------------------------------------------------
  // WRAPPERS para evitar erro do useFormState com funções de assinaturas diferentes
  // ---------------------------------------------------------------------
  const createWrapper = (state: any, payload: any) =>
    createAttendance(state, payload);

  const updateWrapper = (state: any, payload: any) =>
    updateAttendance(state, payload);

  const [state, formAction] = useFormState(
    type === "create" ? createWrapper : updateWrapper,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((formData) => {
    formAction(formData);
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(
        `A presença foi ${
          type === "create" ? "registrada" : "atualizada"
        } com sucesso!`
      );
      setOpen(false);
      router.refresh();
    }
  }, [state, router, setOpen, type]);

  const { students, lessons } = relatedData ?? {
    students: [],
    lessons: [],
  };

  return (
    <form
      className="flex flex-col gap-8"
      onSubmit={onSubmit}
    >
      <h1 className="text-xl font-semibold">
        {type === "create"
          ? "Registrar Presença"
          : "Atualizar Presença"}
      </h1>

      {/* ---------------- LESSON ---------------- */}
      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <label className="text-xs text-gray-500">
          Aula
        </label>
        <select
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          {...register("lessonId")}
          defaultValue={data?.lessonId ?? ""}
        >
          <option value="">Selecione uma aula</option>
          {lessons.map((l: any) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
        {errors.lessonId?.message && (
          <p className="text-xs text-red-500">
            {errors.lessonId.message.toString()}
          </p>
        )}
      </div>

      {/* ---------------- DATE ---------------- */}
      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <label className="text-xs text-gray-500">Data</label>
        <input
          type="date"
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          {...register("date")}
          defaultValue={
            data?.date
              ? new Date(data.date)
                  .toISOString()
                  .split("T")[0]
              : ""
          }
        />
        {errors.date?.message && (
          <p className="text-xs text-red-500">
            {errors.date.message.toString()}
          </p>
        )}
      </div>

      {/* ---------------- STUDENT RECORDS ---------------- */}
      <div className="flex flex-col gap-4">
        <h2 className="font-semibold">Lista de Alunos</h2>

        {students.length === 0 && (
          <p className="text-gray-500">
            Nenhum aluno encontrado para esta turma.
          </p>
        )}

        {students.map((s: any, index: number) => (
          <div
            key={s.id}
            className="p-3 border rounded-md flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <div className="flex flex-col">
              <span className="font-medium">{s.name}</span>

              {/* Campo oculto do aluno */}
              <input
                type="hidden"
                {...register(`records.${index}.studentId`)}
                value={s.id}
              />
            </div>

            {/* STATUS */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-500">
                Status
              </label>
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
                {...register(`records.${index}.status`)}
                defaultValue={
                  data?.records?.[index]?.status ??
                  "PRESENT"
                }
              >
                <option value="PRESENT">Presente</option>
                <option value="ABSENT">Ausente</option>
                <option value="LATE">Atrasado</option>
                <option value="JUSTIFIED">Justificado</option>
                <option value="EXCUSED">Dispensado</option>
              </select>

              {/* Erro do status */}
              {errors.records?.[index]?.status && (
                <p className="text-xs text-red-500">
                  {errors.records[index].status!.message?.toString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {state.error && (
        <span className="text-red-500">
          Algo deu errado ao salvar a presença.
        </span>
      )}

      <button className="bg-blue-500 text-white p-2 rounded-md">
        {type === "create"
          ? "Registrar"
          : "Atualizar"}
      </button>
    </form>
  );
};

export default AttendanceForm;
