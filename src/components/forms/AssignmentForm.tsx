"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { createAssignment, updateAssignment } from "@/lib/actions";
import { Dispatch, SetStateAction } from "react";
import InputField from "./base/InputField";

interface AssignmentFormProps {
  type: "create" | "update";
  setOpen: Dispatch<SetStateAction<boolean>>;
  data?: any;
  relatedData?: {
    lessons?: any[];
  };
}

// O form só manipula strings (porque datetime-local trabalha com string)
interface AssignmentFormData {
  id?: number;
  title: string;
  startDate: string; // datetime-local → string
  dueDate: string; // datetime-local → string
  lessonId: number;
}

// Converte "2025-01-01T12:00:00.000Z" → "2025-01-01T12:00"
function toInputFormat(date?: string) {
  if (!date) return "";
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default function AssignmentForm({
  type,
  setOpen,
  data,
  relatedData,
}: AssignmentFormProps) {
  const lessons = relatedData?.lessons ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignmentFormData>({
    defaultValues: {
      id: data?.id,
      title: data?.title ?? "",
      startDate: toInputFormat(data?.startDate),
      dueDate: toInputFormat(data?.dueDate),
      lessonId: data?.lessonId ?? "",
    },
  });

  const onSubmit: SubmitHandler<AssignmentFormData> = async (formData) => {
    try {
      // payload para que Zod receba Date — como seu schema exige
      const payload = {
        id: formData.id,
        title: formData.title,
        startDate: new Date(formData.startDate),
        dueDate: new Date(formData.dueDate),
        lessonId: Number(formData.lessonId),
      };

      if (type === "create") {
        await createAssignment({ success: false, error: false }, payload);
        toast.success("Tarefa criada com sucesso!");
      } else {
        await updateAssignment({ success: false, error: false }, payload);
        toast.success("Tarefa atualizada com sucesso!");
      }

      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar tarefa");
    }
  };

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Criar Tarefa" : "Atualizar Tarefa"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        {/* Title */}
        <InputField
          label="Título"
          name="title"
          register={register}
          error={errors.title}
        />

        {/* Start Date */}
        <InputField
          label="Início"
          name="startDate"
          type="datetime-local"
          register={register}
          error={errors.startDate}
        />

        {/* Due Date */}
        <InputField
          label="Entrega"
          name="dueDate"
          type="datetime-local"
          register={register}
          error={errors.dueDate}
        />

        {/* Lesson select */}
        <div className="flex flex-col gap-2 w-full md:w-[48%]">
          <label className="text-xs text-gray-500">Aula</label>

          <select
            {...register("lessonId", { required: true })}
            className="w-full p-2 border rounded"
          >
            <option value="">Selecione uma aula</option>
            {lessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.name}
              </option>
            ))}
          </select>

          {errors.lessonId && (
            <span className="text-xs text-red-400">Campo obrigatório</span>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 mt-4">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          {type === "create" ? "Criar" : "Atualizar"}
        </button>

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
