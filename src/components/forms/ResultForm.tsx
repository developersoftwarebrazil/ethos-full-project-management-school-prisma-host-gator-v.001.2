"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
  resultSchema,
  ResultSchema,
} from "@/lib/formValidationSchemas";
import {
  createResult,
  updateResult,
} from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResultSchema>({
    resolver: zodResolver(resultSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createResult : updateResult,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit(async (formData) => {
  try {
    const result =
      type === "create"
        ? await createResult(state, formData) // currentState opcional
        : await updateResult(state, formData);

    if (result.success) {
      toast(`O resultado foi ${type === "create" ? "criado" : "atualizado"}!`);
      setOpen(false); // fecha o modal
      router.refresh(); // atualiza a página
    } else {
      toast.error("Algo deu errado!");
    }
  } catch (err) {
    console.error(err);
    toast.error("Erro ao salvar o resultado!");
  }
});


  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`O resultado foi ${type === "create" ? "criado" : "atualizado"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  // Dados relacionados: students, exams, assignments
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
          defaultValue={data?.score}
          register={register}
          error={errors?.score}
        />

        {/* ID IF UPDATE */}
        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}

        {/* STUDENT */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Aluno</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("studentId")}
            defaultValue={data?.studentId}
          >
            <option value="">Selecione</option>
            {students.map((s: any) => (
              <option
                key={s.id}
                value={s.id}
                selected={data && s.id === data.studentId}
              >
                {s.name} {s.surname}
              </option>
            ))}
          </select>
          {errors.studentId?.message && (
            <p className="text-xs text-red-400">
              {errors.studentId.message.toString()}
            </p>
          )}
        </div>

        {/* EXAM */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Prova (Exam)</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("examId")}
            defaultValue={data?.examId || ""}
          >
            <option value="">Nenhum</option>
            {exams.map((exam: any) => (
              <option
                key={exam.id}
                value={exam.id}
                selected={data && exam.id === data.examId}
              >
                {exam.title}
              </option>
            ))}
          </select>
          {errors.examId?.message && (
            <p className="text-xs text-red-400">
              {errors.examId.message.toString()}
            </p>
          )}
        </div>

        {/* ASSIGNMENT */}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Assignment</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("assignmentId")}
            defaultValue={data?.assignmentId || ""}
          >
            <option value="">Nenhum</option>
            {assignments.map((a: any) => (
              <option
                key={a.id}
                value={a.id}
                selected={data && a.id === data.assignmentId}
              >
                {a.title}
              </option>
            ))}
          </select>
          {errors.assignmentId?.message && (
            <p className="text-xs text-red-400">
              {errors.assignmentId.message.toString()}
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
