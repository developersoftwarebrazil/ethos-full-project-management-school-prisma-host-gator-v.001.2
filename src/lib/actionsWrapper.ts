// src/lib/actionWrappers.ts
"use server";

import {
  // deleteTeacher,
  deleteExam,
  deleteLesson,
  deleteAssignment,
  deleteResult,
  deleteEvent,
  deleteAttendance as deleteAttendanceAction,
  deleteAnnouncement as deleteAnnouncementById,
} from "./actions"; // ajuste o caminho se necessário

import { 
  deleteClass,
  deleteGrade,
  deleteSubject,
  deleteTeacher, 
  deleteParent,
  deleteStudent,
} from "./actions/index"; // ajuste o caminho se necessário

// padrão usado pelo useFormState no seu projeto
export type DeleteState = { success: boolean; error: boolean };

// Cada wrapper tem assinatura (state, formData) => Promise<DeleteState>
// - extrai o id do formData
// - chama a action original (adaptando a assinatura quando necessário)
// - retorna { success, error }
// - captura erros e retorna error = true

async function wrapDeleteWithFormData(
  fn: (currentState: any, data: FormData) => Promise<any>,
  state: DeleteState,
  formData: FormData,
): Promise<DeleteState> {
  try {
    // chama a função que já espera (currentState, formData)
    await fn(state, formData);
    return { success: true, error: false };
  } catch (err) {
    console.error("delete wrapper error:", err);
    return { success: false, error: true };
  }
}

async function wrapDeleteExpectingIdNumber(
  fn: (id: number) => Promise<any>,
  _state: DeleteState,
  formData: FormData,
): Promise<DeleteState> {
  try {
    const raw = formData.get("id");
    const id = typeof raw === "string" ? parseInt(raw, 10) : Number(raw);
    if (!id || isNaN(id)) throw new Error("ID inválido");
    await fn(id);
    return { success: true, error: false };
  } catch (err) {
    console.error("delete wrapper (id) error:", err);
    return { success: false, error: true };
  }
}

async function wrapDeleteExpectingIdString(
  fn: (currentState: any, data: FormData) => Promise<any> | Promise<void> | any,
  state: DeleteState,
  formData: FormData,
): Promise<DeleteState> {
  // Some delete functions expect FormData, others expect string id via data.get('id').
  // We'll attempt to call the fn with (state, formData) and also fallback to calling with parsed id.
  try {
    // prefer calling as (state, formData) if function accepts it (most do)
    const res = await (fn as any)(state, formData);
    // if the function used revalidation logic and didn't return DeleteState, that's ok
    return { success: true, error: false };
  } catch (err) {
    // fallback: try parse id and call with id only
    try {
      const raw = formData.get("id");
      const id = typeof raw === "string" ? raw : String(raw);
      await (fn as any)(id);
      return { success: true, error: false };
    } catch (err2) {
      console.error("delete wrapper fallback error:", err2);
      return { success: false, error: true };
    }
  }
}

// Specific wrappers for each delete action
export const deleteSubjectWrapper = async (
  state: DeleteState,
  formData: FormData,
) => wrapDeleteWithFormData(deleteSubject as any, state, formData);

export const deleteClassWrapper = async (
  state: DeleteState,
  formData: FormData,
) => wrapDeleteWithFormData(deleteClass as any, state, formData);

export const deleteTeacherWrapper = async (
  state: DeleteState,
  formData: FormData,
) => wrapDeleteWithFormData(deleteTeacher as any, state, formData);

export const deleteStudentWrapper = async (
  state: DeleteState,
  formData: FormData,
) => wrapDeleteWithFormData(deleteStudent as any, state, formData);

export const deleteExamWrapper = async (
  state: DeleteState,
  formData: FormData,
) => wrapDeleteWithFormData(deleteExam as any, state, formData);

export const deleteParentWrapper = async (
  state: DeleteState,
  formData: FormData,
) => wrapDeleteWithFormData(deleteParent as any, state, formData);

// lesson wrapper: many variants exist — try formData signature first
export const deleteLessonWrapper = async (
  state: DeleteState,
  formData: FormData,
) => wrapDeleteWithFormData(deleteLesson as any, state, formData);

// grade / assignment / result follow the (state, formData) pattern
export const deleteGradeWrapper = async (
  state: DeleteState,
  formData: FormData,
) => wrapDeleteWithFormData(deleteGrade as any, state, formData);

export const deleteAssignmentWrapper = async (
  state: DeleteState,
  formData: FormData,
) => wrapDeleteWithFormData(deleteAssignment as any, state, formData);

export const deleteResultWrapper = async (
  state: DeleteState,
  formData: FormData,
) => wrapDeleteWithFormData(deleteResult as any, state, formData);

// event wrapper: your deleteEvent expects (currentState, FormData) — use that
export const deleteEventWrapper = async (
  state: DeleteState,
  formData: FormData,
) => wrapDeleteWithFormData(deleteEvent as any, state, formData);

// attendance: in your actions file deleteAttendance signature expects (currentState, data: FormData)
export const deleteAttendanceWrapper = async (
  state: DeleteState,
  formData: FormData,
) => wrapDeleteWithFormData(deleteAttendanceAction as any, state, formData);

// announcement: in your file deleteAnnouncement expects an id:number (or sometimes defined as id:number) — adapt:
export const deleteAnnouncementWrapper = async (
  state: DeleteState,
  formData: FormData,
) =>
  // try id-number wrapper first (safe)
  wrapDeleteExpectingIdNumber(deleteAnnouncementById as any, state, formData);

// Map usado no FormModal
export const deleteActionMap: Record<
  string,
  (s: DeleteState, f: FormData) => Promise<DeleteState>
> = {
  subject: deleteSubjectWrapper,
  class: deleteClassWrapper,
  teacher: deleteTeacherWrapper,
  student: deleteStudentWrapper,
  exam: deleteExamWrapper,
  parent: deleteParentWrapper,
  lesson: deleteLessonWrapper,
  grade: deleteGradeWrapper,
  assignment: deleteAssignmentWrapper,
  result: deleteResultWrapper,
  event: deleteEventWrapper,
  attendance: deleteAttendanceWrapper,
  announcement: deleteAnnouncementWrapper,
};
