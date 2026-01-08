"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "./base/InputField";
import { createGrade, updateGrade } from "@/lib/actions";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { z } from "zod";

// ✅ Esquema de validação
const gradeSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  level: z.coerce.number().min(0, "Nível inválido"),
});

type GradeSchema = z.infer<typeof gradeSchema>;

interface GradeFormProps {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}

export default function GradeForm({ type, data, setOpen }: GradeFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GradeSchema>({
    resolver: zodResolver(gradeSchema),
    defaultValues: {
      description: data?.description || "",
      level: data?.level || 0,
    },
  });

  // ✅ Garante que o formulário recarrega valores ao abrir para editar
  useEffect(() => {
    if (data) {
      reset({
        description: data.description || "",
        level: data.level || 0,
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData: GradeSchema) => {
    try {
      if (type === "create") {
        await createGrade(formData);
      } else {
        await updateGrade({ ...formData, id: data.id });
      }

      toast.success(
        `A série foi ${type === "create" ? "criada" : "atualizada"}!`
      );
      setOpen(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Algo deu errado!");
    }
  };

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Criar série" : "Atualizar série"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Descrição"
          name="description"
          register={register}
          error={errors.description}
        />

        <InputField
          label="Nível"
          name="level"
          type="number"
          register={register}
          error={errors.level}
        />
      </div>

      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Criar" : "Atualizar"}
      </button>
    </form>
  );
}
