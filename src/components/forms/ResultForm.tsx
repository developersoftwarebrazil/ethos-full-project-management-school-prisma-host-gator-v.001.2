"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import InputField from "./base/InputField";
import { resultSchema, ResultSchema } from "@/lib/formValidationSchemas";
import { createResult, updateResult } from "@/lib/actions/index";
import { useFormState } from "react-dom";

const ResultForm = ({
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
  const router = useRouter();

  // ✅ react-hook-form com defaultValues corretos
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResultSchema>({
    resolver: zodResolver(resultSchema),
    defaultValues: {
      id: data?.id,
      score: data?.score,
      studentId: data?.studentId ?? "",
      examId: data?.examId ?? "",
      assignmentId: data?.assignmentId ?? "",
    },
  });

  const [state, formAction] = useFormState(
    type === "create" ? createResult : updateResult,
    {
      success: false,
      error: false,
    }
  );

  // ✅ submit manual (mantendo seu padrão)
  const onSubmit = handleSubmit(async (formData) => {
    const result =
      type === "create"
        ? await createResult(state, formData)
        : await updateResult(state, formData);

    if (result.success) {
      toast(
        `O resultado foi ${type === "create" ? "criado" : "atualizado"}!`
      );
      setOpen(false);
      router.refresh();
    } else {
      toast.error("Algo deu errado!");
    }
  });

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      router.refresh();
    }
  }, [state, router, setOpen]);

  const { students, exams, assignments } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Criar Resultado" : "Atualizar Resultado"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        {/* SCORE */}
        <InputField
          label="Nota"
          name="score"
          register={register}
          error={errors.score}
        />

        {/* ID (somente update) */}
        {type === "update" && (
          <InputField
            label="Id"
            name="id"
            register={register}
            error={errors.id}
            hidden
          />
        )}

        {/* STUDENT */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Aluno</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("studentId")}
          >
            <option value="">Selecione</option>
            {students.map((s: any) => (
              <option key={s.id} value={s.id}>
                {s.name} {s.surname}
              </option>
            ))}
          </select>
          {errors.studentId && (
            <p className="text-xs text-red-400">
              {errors.studentId.message}
            </p>
          )}
        </div>

        {/* EXAM */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Prova</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("examId")}
          >
            <option value="">Nenhum</option>
            {exams.map((exam: any) => (
              <option key={exam.id} value={exam.id}>
                {exam.title}
              </option>
            ))}
          </select>
          {errors.examId && (
            <p className="text-xs text-red-400">
              {errors.examId.message}
            </p>
          )}
        </div>

        {/* ASSIGNMENT */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Assignment</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("assignmentId")}
          >
            <option value="">Nenhum</option>
            {assignments.map((a: any) => (
              <option key={a.id} value={a.id}>
                {a.title}
              </option>
            ))}
          </select>
          {errors.assignmentId && (
            <p className="text-xs text-red-400">
              {errors.assignmentId.message}
            </p>
          )}
        </div>
      </div>

      {state.error && (
        <span className="text-red-500">Algo deu errado!</span>
      )}

      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Criar" : "Atualizar"}
      </button>
    </form>
  );
};

export default ResultForm;
