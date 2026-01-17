/**
 * ================================
 * 🔐 ACTIONS – ENTRY POINT
 * ================================
 * NÃO importar actions direto dos módulos
 * Sempre passar por este index
 */

import { create } from "domain";

// ================================
// 🆕 NOVO (MODULE-BASED)
// ================================
export * from "@/lib/actions";

// 📕 PERSONS
export { createTeacher } from "./users/teacher.actions";
export { updateTeacher } from "./users/teacher.actions";
export { deleteTeacher } from "./users/teacher.actions";

export { createStudent } from "./users/student.action";
export { updateStudent } from "./users/student.action";
export { deleteStudent } from "./users/student.action";

export { createParent } from "./users/parent.action";
export { updateParent } from "./users/parent.action";
export { deleteParent } from "./users/parent.action";

// 📕 SCHOOLS
export { createGrade } from "./school/grade.actions";
export { updateGrade } from "./school/grade.actions";
export { deleteGrade } from "./school/grade.actions";

export { createClass } from "./school/class.action";
export { updateClass } from "./school/class.action";
export { deleteClass } from "./school/class.action";

export { createSubject } from "./school/subjects.action";
export { updateSubject } from "./school/subjects.action";
export { deleteSubject } from "./school/subjects.action";

export { createLesson } from "./school/lesson.action";
export { updateLesson } from "./school/lesson.action";
export { deleteLesson } from "./school/lesson.action";

export { createExam } from "./school/exams.actions";  
export { updateExam } from "./school/exams.actions";
export { deleteExam } from "./school/exams.actions";

export { createAssignment } from "./school/assignment.action";
export { updateAssignment } from "./school/assignment.action";
export { deleteAssignment } from "./school/assignment.action";

export { createResult } from "./school/result.action";
export { updateResult } from "./school/result.action";
export { deleteResult } from "./school/result.action";

// ================================
// 🧓 LEGADO (TEMPORÁRIO)
// ================================
// ⚠️ Remover aos poucos conforme migrar
// export * from "../actions"; // use somente se ainda houver ações antigas
