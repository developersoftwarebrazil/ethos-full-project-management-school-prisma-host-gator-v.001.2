"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { createAssignment, updateAssignment } from "@/lib/actions";
import { Dispatch, SetStateAction } from "react";
import InputField from "../InputField";

interface AssignmentFormProps {
  type: "create" | "update" | "delete";
  setOpen: Dispatch<SetStateAction<boolean>>;
  data?: any;
  relatedData?: {
    lessons?: any[];
  };
}

interface AssignmentFormData {
  id?: number;
  title: string;
  startDate: string;
  dueDate: string;
  lessonId: number;
  supervisorId?: string;
  result: number;
}

export default function AssignmentForm({
  type,
  setOpen,
  data,
  relatedData,
}: AssignmentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignmentFormData>({
    defaultValues: data || {},
  });
const onSubmit: SubmitHandler<AssignmentFormData> = async (formData) => {
  try {
    // Conversão obrigatória
    const payload = {
      ...formData,
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
    toast.error("Erro ao salvar tarefa!");
    console.error(err);
  }
};


  // const { lessons } = relatedData || {};
  const lessons = relatedData?.lessons ?? [];


  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Criar nova tarefa" : "Atualizar tarefa"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Nome da Tarefa"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors.title}
        />

        <InputField
          label="Início"
          name="startDate"
          type="time"
          defaultValue={data?.startDate}
          register={register}
          error={errors.startDate}
        />

        {/* CORREÇÃO AQUI: name="dueDate" */}
        <InputField
          label="Término"
          name="dueDate"
          type="time"
          defaultValue={data?.dueDate}
          register={register}
          error={errors.dueDate}
        />

        <div className="flex flex-col gap-2 w-full md:w-[48%]">
          <label className="text-xs text-gray-500">Aula</label>
          <select
            {...register("lessonId", { required: true })}
            className="w-full p-2 border rounded"
          >
            <option value="">Selecione a aula</option>
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
