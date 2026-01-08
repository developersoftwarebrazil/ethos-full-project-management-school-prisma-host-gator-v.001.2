"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { createAnnouncement, updateAnnouncement } from "@/lib/actions";
import { Dispatch, SetStateAction } from "react";
import InputField from "./base/InputField";

interface AnnouncementFormProps {
  type: "create" | "update";
  setOpen: Dispatch<SetStateAction<boolean>>;
  data?: any;
  relatedData?: {
    classes?: any[];
  };
}

// O formulário trabalha apenas com string
interface AnnouncementFormData {
  id?: number;
  title: string;
  description: string;
  date: string; // datetime-local → string
  classId?: number | "";
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

export default function AnnouncementForm({
  type,
  setOpen,
  data,
  relatedData,
}: AnnouncementFormProps) {
  const classes = relatedData?.classes ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnnouncementFormData>({
    defaultValues: {
      id: data?.id,
      title: data?.title ?? "",
      description: data?.description ?? "",
      date: toInputFormat(data?.date),
      classId: data?.classId ?? "",
    },
  });

  const onSubmit: SubmitHandler<AnnouncementFormData> = async (formData) => {
    try {
      const payload = {
        id: formData.id,
        title: formData.title,
        description: formData.description,
        date: new Date(formData.date),
        classId: formData.classId ? Number(formData.classId) : null, // ⭐ CORREÇÃO IMPORTANTE
      };

      if (type === "create") {
        await createAnnouncement(payload);
        toast.success("Anúncio criado com sucesso!");
      } else {
        await updateAnnouncement(payload);
        toast.success("Anúncio atualizado com sucesso!");
      }

      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar anúncio");
    }
  };

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Criar Anúncio" : "Atualizar Anúncio"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        {/* Title */}
        <InputField
          label="Título"
          name="title"
          register={register}
          error={errors.title}
        />

        {/* Date */}
        <InputField
          label="Data"
          name="date"
          type="datetime-local"
          register={register}
          error={errors.date}
        />

        {/* Description */}
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xs text-gray-500">Descrição</label>
          <textarea
            {...register("description", { required: true })}
            className="w-full p-2 border rounded"
            rows={4}
            placeholder="Digite a descrição"
          />
          {errors.description && (
            <span className="text-xs text-red-400">Campo obrigatório</span>
          )}
        </div>

        {/* Class select */}
        <div className="flex flex-col gap-2 w-full md:w-[48%]">
          <label className="text-xs text-gray-500">Turma (opcional)</label>

          <select
            {...register("classId")}
            className="w-full p-2 border rounded"
          >
            <option value="">Nenhuma turma</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
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
