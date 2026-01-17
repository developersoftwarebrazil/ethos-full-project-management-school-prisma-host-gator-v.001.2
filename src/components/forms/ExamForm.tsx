"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "./base/InputField";
import {
  examSchema,
  ExamSchema,
  subjectSchema,
  SubjectSchema,
} from "@/lib/formValidationSchemas";
import {
  createExam,
  createSubject,
  updateExam,
  updateSubject,
} from "@/lib/actions/index";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ExamForm = ({
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
  } = useForm<ExamSchema>({
    resolver: zodResolver(examSchema),
  });

  // AFTER REACT 19 IT'LL BE USEACTIONSTATE

  const [state, formAction] = useFormState(
    type === "create" ? createExam : updateExam,
    {
      success: false,
      error: false,
    }
  );

  // const onSubmit = handleSubmit((data) => {
  //   console.log(data);
  //   formAction(data);
  // });
  const onSubmit = handleSubmit(async (formData) => {
    try {
      const currentState = { success: false, error: false };

      const result =
        type === "create"
          ? await createExam(currentState, formData)
          : await updateExam(currentState, formData);

      if (result.success) {
        toast(`A Prova foi ${type === "create" ? "criada" : "atualizada"}!`);
        setOpen(false); // Fecha o modal
        router.refresh(); // Atualiza a página
      } else {
        toast.error("Algo deu errado!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar a prova!");
    }
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`A Prova foi ${type === "create" ? "criada" : "atualizada"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { lessons } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Criar uma nova prova" : "Atualizar a prova"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Título da Prova"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />
        <InputField
          label="Data de Início"
          name="startTime"
          defaultValue={data?.startTime}
          register={register}
          error={errors?.startTime}
          type="datetime-local"
        />
        <InputField
          label="Data de Término"
          name="endTime"
          defaultValue={data?.endTime}
          register={register}
          error={errors?.endTime}
          type="datetime-local"
        />
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
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Aula</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("lessonId")}
            defaultValue={data?.teachers}
          >
            {lessons.map((lesson: { id: number; name: string }) => (
              <option value={lesson.id} key={lesson.id}>
                {lesson.name}
              </option>
            ))}
          </select>
          {errors.lessonId?.message && (
            <p className="text-xs text-red-400">
              {errors.lessonId.message.toString()}
            </p>
          )}
        </div>
      </div>
      {state.error && <span className="text-red-500">Algo deu errado!</span>}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Criar" : "Atualizar"}
      </button>
    </form>
  );
};

export default ExamForm;
