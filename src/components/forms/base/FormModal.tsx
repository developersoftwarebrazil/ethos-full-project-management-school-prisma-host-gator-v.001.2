"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";

import { deleteActionMap } from "@/lib/actionsWrapper";
import { FormContainerProps } from "./FormContainer";

// FORMS (LAZY LOAD)
const TeacherForm = dynamic(() => import("../TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("../StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ParentForm = dynamic(() => import("../ParentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const SubjectForm = dynamic(() => import("../SubjectForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ClassForm = dynamic(() => import("../ClassForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ExamForm = dynamic(() => import("../ExamForm"), {
  loading: () => <h1>Loading...</h1>,
});
const LessonForm = dynamic(() => import("../LessonForm"), {
  loading: () => <h1>Loading...</h1>,
});
const GradeForm = dynamic(() => import("../GradeForm"), {
  loading: () => <h1>Loading...</h1>,
});
const AssignmentForm = dynamic(() => import("../AssignmentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ResultForm = dynamic(() => import("../ResultForm"), {
  loading: () => <h1>Loading...</h1>,
});
const EventForm = dynamic(() => import("../EventForm"), {
  loading: () => <h1>Loading...</h1>,
});
const AttendanceForm = dynamic(() => import("../AttendanceForm"), {
  loading: () => <h1>Loading...</h1>,
});
const AnnouncementForm = dynamic(() => import("../AnnouncementForm"), {
  loading: () => <h1>Loading...</h1>,
});

// FORM REGISTRY
const forms: {
  [key: string]: (
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: "create" | "update",
    data?: any,
    relatedData?: any
  ) => JSX.Element;
} = {
  subject: (setOpen, type, data, relatedData) => (
    <SubjectForm {...{ type, data, setOpen, relatedData }} />
  ),
  class: (setOpen, type, data, relatedData) => (
    <ClassForm {...{ type, data, setOpen, relatedData }} />
  ),
  teacher: (setOpen, type, data, relatedData) => (
    <TeacherForm {...{ type, data, setOpen, relatedData }} />
  ),
  student: (setOpen, type, data, relatedData) => (
    <StudentForm {...{ type, data, setOpen, relatedData }} />
  ),
  parent: (setOpen, type, data, relatedData) => (
    <ParentForm {...{ type, data, setOpen, relatedData }} />
  ),
  exam: (setOpen, type, data, relatedData) => (
    <ExamForm {...{ type, data, setOpen, relatedData }} />
  ),
  lesson: (setOpen, type, data, relatedData) => (
    <LessonForm {...{ type, data, setOpen, relatedData }} />
  ),
  grade: (setOpen, type, data, relatedData) => (
    <GradeForm {...{ type, data, setOpen, relatedData }} />
  ),
  assignment: (setOpen, type, data, relatedData) => (
    <AssignmentForm {...{ type, data, setOpen, relatedData }} />
  ),
  result: (setOpen, type, data, relatedData) => (
    <ResultForm {...{ type, data, setOpen, relatedData }} />
  ),
  event: (setOpen, type, data, relatedData) => (
    <EventForm {...{ type, data, setOpen, relatedData }} />
  ),
  attendance: (setOpen, type, data, relatedData) => (
    <AttendanceForm {...{ type, data, setOpen, relatedData }} />
  ),
  announcement: (setOpen, type, data, relatedData) => (
    <AnnouncementForm {...{ type, data, setOpen, relatedData }} />
  ),
};

const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
}: FormContainerProps & { relatedData?: any }) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
      ? "bg-lamaSky"
      : "bg-lamaPurple";

  const [open, setOpen] = useState(false);

  const Form = () => {
    const [state, formAction] = useFormState(deleteActionMap[table], {
      success: false,
      error: false,
    });

    const router = useRouter();

    useEffect(() => {
      if (state.success) {
        toast(`${table} has been deleted!`);
        setOpen(false);
        router.refresh();
      }
    }, [state, router]);

    return type === "delete" && id ? (
      <form action={formAction} className="p-4 flex flex-col gap-4">
        <input type="text" name="id" value={id} hidden readOnly />
        <span className="text-center font-medium">
          Todos os dados serão perdidos. Você tem certeza que deseja deletar
          este {table}?
        </span>
        <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
          Deletar
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table](setOpen, type, data, relatedData)
    ) : (
      "Form not found!"
    );
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>

      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
