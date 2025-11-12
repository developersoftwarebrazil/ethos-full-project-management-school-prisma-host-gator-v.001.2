"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { createLesson, updateLesson } from "@/lib/actions";
import { Dispatch, SetStateAction } from "react";
import InputField from "../InputField";

interface LessonFormProps {
  type: "create" | "update" | "delete";
  setOpen: Dispatch<SetStateAction<boolean>>;
  data?: any;
  relatedData?: {
    subjects?: any[];
    teachers?: any[];
    classes?: any[];
  };
}

interface LessonFormData {
  id?: number;
  name: string;
  subjectId: number; // agora single
  teacherId: string; // agora single
  classId: number; // agora single
  day: string;
  startTime: string; // "14:00"
  endTime: string; // "16:00"
}

export default function LessonForm({
  type,
  setOpen,
  data,
  relatedData,
}: LessonFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LessonFormData>({
    defaultValues: data || {},
  });

  const onSubmit: SubmitHandler<LessonFormData> = async (formData) => {
    try {
      if (type === "create") {
        await createLesson(formData);
        toast.success("Aula criada com sucesso!");
      } else {
        await updateLesson(formData);
        toast.success("Aula atualizada com sucesso!");
      }
      setOpen(false);
    } catch (err) {
      toast.error("Erro ao salvar aula!");
      console.error(err);
    }
  };

  const { subjects, teachers, classes } = relatedData || {};

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Criar nova aula" : "Atualizar aula"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Nome da Aula"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors.name}
        />
        {/* DIA DA SEMANA (enum do Prisma) */}
        <div className="flex flex-col gap-2 w-full md:w-[48%]">
          <label className="text-xs text-gray-500">Dia da Semana</label>
          <select
            {...register("day", { required: true })}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.day || ""}
          >
            <option value="">Selecione</option>
            <option value="MONDAY">Segunda-feira</option>
            <option value="TUESDAY">Terça-feira</option>
            <option value="WEDNESDAY">Quarta-feira</option>
            <option value="THURSDAY">Quinta-feira</option>
            <option value="FRIDAY">Sexta-feira</option>
          </select>
          {errors.day && (
            <span className="text-xs text-red-400">Campo obrigatório</span>
          )}
        </div>

        <InputField
          label="Início"
          name="startTime"
          type="time"
          defaultValue={data?.startTime}
          register={register}
          error={errors.startTime}
        />

        <InputField
          label="Término"
          name="endTime"
          type="time"
          defaultValue={data?.endTime}
          register={register}
          error={errors.endTime}
        />

        {/* DISCIPLINA (single) */}
        <div className="flex flex-col gap-2 w-full md:w-[48%]">
          <label className="text-xs text-gray-500">Disciplina</label>
          <select
            {...register("subjectId", { required: true, valueAsNumber: true })}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.subjectId ? String(data.subjectId) : ""}
          >
            <option value="">Selecione</option>
            {subjects?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          {errors.subjectId && (
            <span className="text-xs text-red-400">Campo obrigatório</span>
          )}
        </div>

        {/* PROFESSOR (single) */}
        <div className="flex flex-col gap-2 w-full md:w-[48%]">
          <label className="text-xs text-gray-500">Professor</label>
          <select
            {...register("teacherId", { required: true })}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.teacherId || ""}
          >
            <option value="">Selecione</option>
            {teachers?.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          {errors.teacherId && (
            <span className="text-xs text-red-400">Campo obrigatório</span>
          )}
        </div>

        {/* TURMA (single) */}
        <div className="flex flex-col gap-2 w-full md:w-[48%]">
          <label className="text-xs text-gray-500">Turma</label>
          <select
            {...register("classId", { required: true, valueAsNumber: true })}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={data?.classId ? String(data.classId) : ""}
          >
            <option value="">Selecione</option>
            {classes?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.classId && (
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
