// "use server";

// import { revalidatePath } from "next/cache";
// import {
//   ClassSchema,
//   ExamSchema,
//   StudentSchema,
//   SubjectSchema,
//   TeacherSchema,
//   LessonSchema,
//   GradeSchema,
//   ParentSchema,
//   ResultSchema,
//   EventSchema,
//   AttendanceSchema,
//   AnnouncementSchema,
//   AssignmentSchema,
// } from "./formValidationSchemas";

// import prisma from "./prisma";

// /**
//  * ================================
//  * 🔁 CLERK (DESATIVADO TEMPORARIAMENTE)
//  * Quando voltar a usar Clerk:
//  * 1) Reativar imports abaixo
//  * 2) Substituir requireAuth() por auth()
//  * ================================
//  */
// // import { clerkClient } from "@clerk/nextjs/server";
// // import { auth } from "@clerk/nextjs/server";


// import { requireAuth } from "@/lib/auth";

// import dayjs from "dayjs";
// import { AttendanceStatus } from "@prisma/client";

// type CurrentState = { success: boolean; error: boolean };
// const ok = { success: true, error: false };
// const fail = { success: false, error: true };


// /* =====================================================
//    🔐 HELPERS
// ===================================================== */
// const getCurrentUser=async () => {
//   return await requireAuth();
// };

// /* =====================================================
//    🟩 GRADES
// ===================================================== */

// export const createGrade = async (data: GradeSchema) => {
//   try {
//     await prisma.grade.create({
//       data: {
//         // converte para número
//         level: Number(data.level),
//         description: data.description,
//       },
//     });

//     revalidatePath("/list/grades");
//     return { success: true, error: false };
//   } catch (error) {
//     console.error("❌ Erro ao criar série:", error);
//     return { success: false, error: true };
//   }
// };

// export const updateGrade = async (data: GradeSchema) => {
//   try {
//     if (!data.id) {
//       throw new Error("ID é obrigatório para atualização.");
//     }

//     await prisma.grade.update({
//       where: { id: data.id },
//       data: {
//         // também garante que seja número
//         level: Number(data.level),
//         description: data.description,
//       },
//     });

//     revalidatePath("/list/grades");
//     return { success: true, error: false };
//   } catch (error) {
//     console.error("❌ Erro ao atualizar série:", error);
//     return { success: false, error: true };
//   }
// };

// export const deleteGrade = async (
//   currentState: { success: boolean; error: boolean },
//   formData: FormData
// ) => {
//   try {
//     const id = Number(formData.get("id"));

//     if (!id || isNaN(id)) {
//       throw new Error("ID inválido para exclusão");
//     }

//     await prisma.grade.delete({
//       where: { id },
//     });

//     return { success: true, error: false };
//   } catch (err) {
//     console.error("Erro ao deletar grade:", err);
//     return { success: false, error: true };
//   }
// };

// /* =====================================================
//    🟩 SUBJECTS
// ===================================================== */
// export const createSubject = async (
//   currentState: CurrentState,
//   data: SubjectSchema
// ) => {
//   try {
//     await prisma.subject.create({
//       data: {
//         name: data.name,
//         teachers: {
//           connect: data.teachers.map((teacherId) => ({ id: teacherId })),
//         },
//       },
//     });

//     // revalidatePath("/list/subjects");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log(err);
//     return { success: false, error: true };
//   }
// };

// export const updateSubject = async (
//   currentState: CurrentState,
//   data: SubjectSchema
// ) => {
//   try {
//     await prisma.subject.update({
//       where: {
//         id: data.id,
//       },
//       data: {
//         name: data.name,
//         teachers: {
//           set: data.teachers.map((teacherId) => ({ id: teacherId })),
//         },
//       },
//     });

//     // revalidatePath("/list/subjects");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log(err);
//     return { success: false, error: true };
//   }
// };

// export const deleteSubject = async (
//   currentState: CurrentState,
//   data: FormData
// ) => {
//   const id = data.get("id") as string;
//   try {
//     await prisma.subject.delete({
//       where: {
//         id: parseInt(id),
//       },
//     });

//     // revalidatePath("/list/subjects");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log(err);
//     return { success: false, error: true };
//   }
// };

// export const createClass = async (
//   currentState: CurrentState,
//   data: ClassSchema
// ) => {
//   try {
//     await prisma.class.create({
//       data,
//     });

//     // revalidatePath("/list/class");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log(err);
//     return { success: false, error: true };
//   }
// };

// export const updateClass = async (
//   currentState: CurrentState,
//   data: ClassSchema
// ) => {
//   try {
//     await prisma.class.update({
//       where: {
//         id: data.id,
//       },
//       data,
//     });

//     // revalidatePath("/list/class");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log(err);
//     return { success: false, error: true };
//   }
// };

// export const deleteClass = async (
//   currentState: CurrentState,
//   data: FormData
// ) => {
//   const id = data.get("id") as string;
//   try {
//     await prisma.class.delete({
//       where: {
//         id: parseInt(id),
//       },
//     });

//     // revalidatePath("/list/class");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log(err);
//     return { success: false, error: true };
//   }
// };

// export const createTeacher = async (
//   currentState: CurrentState,
//   data: TeacherSchema
// ) => {
//   try {
//     const user = await clerkClient.users.createUser({
//       username: data.username,
//       password: data.password,
//       firstName: data.name,
//       lastName: data.surname,
//       emailAddress: data.email ? [data.email] : undefined,
//       publicMetadata: { role: "teacher" },
//     });

//     await prisma.teacher.create({
//       data: {
//         id: user.id,
//         username: data.username,
//         name: data.name,
//         surname: data.surname,
//         email: data.email || null,
//         phone: data.phone || null,
//         address: data.address,
//         img: data.img || null,
//         bloodType: data.bloodType,
//         sex: data.sex,
//         birthday: data.birthday,
//         subjects: {
//           connect: data.subjects?.map((subjectId: string) => ({
//             id: parseInt(subjectId),
//           })),
//         },
//       },
//     });

//     // revalidatePath("/list/teachers");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log(err);
//     return { success: false, error: true };
//   }
// };

// export const updateTeacher = async (
//   currentState: CurrentState,
//   data: TeacherSchema
// ) => {
//   if (!data.id) {
//     return { success: false, error: true };
//   }
//   try {
//     const user = await clerkClient.users.updateUser(data.id, {
//       username: data.username,
//       ...(data.password !== "" && { password: data.password }),
//       firstName: data.name,
//       lastName: data.surname,
//     });

//     await prisma.teacher.update({
//       where: {
//         id: data.id,
//       },
//       data: {
//         ...(data.password !== "" && { password: data.password }),
//         username: data.username,
//         name: data.name,
//         surname: data.surname,
//         email: data.email || null,
//         phone: data.phone || null,
//         address: data.address,
//         img: data.img || null,
//         bloodType: data.bloodType,
//         sex: data.sex,
//         birthday: data.birthday,
//         subjects: {
//           set: data.subjects?.map((subjectId: string) => ({
//             id: parseInt(subjectId),
//           })),
//         },
//       },
//     });
//     // revalidatePath("/list/teachers");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log(err);
//     return { success: false, error: true };
//   }
// };

// export const deleteTeacher = async (
//   currentState: CurrentState,
//   data: FormData
// ) => {
//   const id = data.get("id") as string;
//   try {
//     await clerkClient.users.deleteUser(id);

//     await prisma.teacher.delete({
//       where: {
//         id: id,
//       },
//     });

//     // revalidatePath("/list/teachers");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log(err);
//     return { success: false, error: true };
//   }
// };

// export const createStudent = async (
//   currentState: CurrentState,
//   data: StudentSchema
// ) => {
//   console.log(data);
//   try {
//     const classItem = await prisma.class.findUnique({
//       where: { id: Number(data.classId) },
//       include: { _count: { select: { students: true } } },
//     });

//     if (classItem && classItem.capacity === classItem._count.students) {
//       return { success: false, error: true };
//     }

//     const user = await clerkClient.users.createUser({
//       username: data.username,
//       password: data.password,
//       firstName: data.name,
//       lastName: data.surname,
//       emailAddress: data.email ? [data.email] : undefined,
//       publicMetadata: { role: "student" },
//     });

//     await prisma.student.create({
//       data: {
//         id: user.id,
//         username: data.username,
//         name: data.name,
//         surname: data.surname,
//         email: data.email || null,
//         phone: data.phone || null,
//         address: data.address,
//         img: data.img || null,
//         bloodType: data.bloodType,
//         sex: data.sex,
//         birthday: new Date(data.birthday), // FIX 1
//         gradeId: Number(data.gradeId), // FIX 2
//         classId: Number(data.classId), // FIX 3
//         parentId: String(data.parentId), // FIX 4
//       },
//     });

//     return { success: true, error: false };
//   } catch (err) {
//     console.log("❌ ERRO createStudent:", err);
//     return { success: false, error: true };
//   }
// };

// export const updateStudent = async (
//   currentState: CurrentState,
//   data: StudentSchema
// ) => {
//   if (!data.id) {
//     return { success: false, error: true };
//   }
//   try {
//     const user = await clerkClient.users.updateUser(data.id, {
//       username: data.username,
//       ...(data.password !== "" && { password: data.password }),
//       firstName: data.name,
//       lastName: data.surname,
//     });

//     await prisma.student.update({
//       where: {
//         id: data.id,
//       },
//       data: {
//         ...(data.password !== "" && { password: data.password }),
//         username: data.username,
//         name: data.name,
//         surname: data.surname,
//         email: data.email || null,
//         phone: data.phone || null,
//         address: data.address,
//         img: data.img || null,
//         bloodType: data.bloodType,
//         sex: data.sex,
//         birthday: data.birthday,
//         gradeId: data.gradeId,
//         classId: data.classId,
//         parentId: data.parentId,
//       },
//     });
//     // revalidatePath("/list/students");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log(err);
//     return { success: false, error: true };
//   }
// };

// export const deleteStudent = async (
//   currentState: CurrentState,
//   data: FormData
// ) => {
//   const id = data.get("id") as string;
//   try {
//     await clerkClient.users.deleteUser(id);

//     await prisma.student.delete({
//       where: {
//         id: id,
//       },
//     });

//     // revalidatePath("/list/students");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log(err);
//     return { success: false, error: true };
//   }
// };

// export const createExam = async (
//   currentState: CurrentState,
//   data: ExamSchema
// ) => {
//   try {
//     await prisma.exam.create({
//       data: {
//         title: data.title,
//         startTime: data.startTime,
//         endTime: data.endTime,
//         lessonId: data.lessonId,
//       },
//     });

//     revalidatePath("/list/subjects");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log(err);
//     return { success: false, error: true };
//   }
// };

// export const updateExam = async (
//   currentState: CurrentState,
//   data: ExamSchema
// ) => {
//   // const { userId, sessionClaims } = auth();
//   // const role = (sessionClaims?.metadata as { role?: string })?.role;

//   try {
//     // if (role === "teacher") {
//     //   const teacherLesson = await prisma.lesson.findFirst({
//     //     where: {
//     //       teacherId: userId!,
//     //       id: data.lessonId,
//     //     },
//     //   });

//     //   if (!teacherLesson) {
//     //     return { success: false, error: true };
//     //   }
//     // }

//     await prisma.exam.update({
//       where: {
//         id: data.id,
//       },
//       data: {
//         title: data.title,
//         startTime: data.startTime,
//         endTime: data.endTime,
//         lessonId: data.lessonId,
//       },
//     });

//     // revalidatePath("/list/subjects");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log(err);
//     return { success: false, error: true };
//   }
// };

// export const deleteExam = async (
//   currentState: CurrentState,
//   data: FormData
// ) => {
//   const id = data.get("id") as string;

//   // const { userId, sessionClaims } = auth();
//   // const role = (sessionClaims?.metadata as { role?: string })?.role;

//   try {
//     await prisma.exam.delete({
//       where: {
//         id: parseInt(id),
//         // ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
//       },
//     });

//     // revalidatePath("/list/subjects");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log(err);
//     return { success: false, error: true };
//   }
// };

// export async function createLesson(data: any) {
//   try {
//     // converte "07:00" em um objeto Date válido no formato ISO
//     const startTime = new Date(`1970-01-01T${data.startTime}:00Z`);
//     const endTime = new Date(`1970-01-01T${data.endTime}:00Z`);

//     await prisma.lesson.create({
//       data: {
//         name: data.name,
//         subjectId: Number(data.subjectId),
//         teacherId: data.teacherId,
//         classId: Number(data.classId),
//         day: data.day,
//         startTime,
//         endTime,
//       },
//     });

//     revalidatePath("/list/subjects"); // opcional, se quiser revalidar
//     return { success: true, error: false };
//   } catch (err) {
//     console.error("Erro ao criar aula:", err);
//     return { success: false, error: true };
//   }
// }

// export async function updateLesson(data: any) {
//   try {
//     await prisma.lesson.update({
//       where: { id: Number(data.id) },
//       data: {
//         name: data.name,
//         subjectId: Number(data.subjectId),
//         teacherId: data.teacherId,
//         // gradeId: Number(data.gradeId), // caso queira ativar depois
//         classId: Number(data.classId),
//         day: data.day,
//         startTime: new Date(`1970-01-01T${data.startTime}:00Z`),
//         endTime: new Date(`1970-01-01T${data.endTime}:00Z`),
//       },
//     });

//     revalidatePath("/list/subjects"); // revalida cache se necessário
//     return { success: true, error: false };
//   } catch (err) {
//     console.error("Erro ao atualizar aula:", err);
//     return { success: false, error: true };
//   }
// }

// // 🟥 Deletar lesson
// export const deleteLesson = async (
//   currentState: CurrentState,
//   formData: FormData
// ) => {
//   const id = Number(formData.get("id"));

//   try {
//     await prisma.lesson.delete({
//       where: { id },
//     });

//     return { success: true, error: false };
//   } catch (err) {
//     console.error(err);
//     return { success: false, error: true };
//   }
// };

// // 🟩 Criar novo parent
// export const createParent = async (
//   currentState: CurrentState,
//   data: ParentSchema
// ) => {
//   try {
//     const user = await clerkClient.users.createUser({
//       username: data.username,
//       password: data.password,
//       firstName: data.name,
//       lastName: data.surname,
//       emailAddress: data.email ? [data.email] : undefined,
//       publicMetadata: { role: "parent" },
//     });

//     await prisma.parent.create({
//       data: {
//         id: user.id,
//         username: data.username,
//         name: data.name,
//         surname: data.surname,
//         email: data.email || null,
//         phone: data.phone ?? "",
//         address: data.address,
//         students: {
//           connect: data.student?.map((studentId: string) => ({
//             id: studentId,
//           })),
//         },
//       },
//     });

//     // revalidatePath("/list/teachers");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log(err);
//     return { success: false, error: true };
//   }
// };

// // 🟦 Atualizar parent
// export const updateParent = async (
//   currentState: CurrentState,
//   data: ParentSchema
// ) => {
//   if (!data.id) {
//     return { success: false, error: true };
//   }
//   try {
//     const user = await clerkClient.users.updateUser(data.id, {
//       username: data.username,
//       ...(data.password !== "" && { password: data.password }),
//       firstName: data.name,
//       lastName: data.surname,
//     });

//     await prisma.parent.update({
//       where: {
//         id: data.id,
//       },
//       data: {
//         ...(data.password !== "" && { password: data.password }),
//         username: data.username,
//         name: data.name,
//         surname: data.surname,
//         email: data.email || null,
//         phone: data.phone ?? "",
//         address: data.address,
//         students: {
//           set: data.student?.map((studentId: string) => ({
//             id: studentId,
//           })),
//         },
//       },
//     });
//     // revalidatePath("/list/teachers");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log(err);
//     return { success: false, error: true };
//   }
// };
// // 🟥 Deletar parent
// export const deleteParent = async (
//   currentState: CurrentState,
//   formData: FormData
// ) => {
//   const id = formData.get("id") as string;

//   try {
//     await clerkClient.users.deleteUser(id);

//     await prisma.parent.delete({
//       where: { id },
//     });

//     return { success: true, error: false };
//   } catch (err) {
//     console.error(err);
//     return { success: false, error: true };
//   }
// };

// // 🟩 Criar novo assignment
// export const createAssignment = async (
//   currentState: CurrentState,
//   data: AssignmentSchema
// ) => {
//   const { userId, sessionClaims } = auth();
//   const role = (sessionClaims?.metadata as { role?: string })?.role;

//   try {
//     // Se professor, verificar se a aula pertence ao professor
//     if (role === "teacher") {
//       const lesson = await prisma.lesson.findUnique({
//         where: { id: Number(data.lessonId) },
//       });

//       if (!lesson || lesson.teacherId !== userId) {
//         return { success: false, error: true };
//       }
//     }

//     await prisma.assignment.create({
//       data: {
//         title: data.title,
//         startDate: data.startDate, // validado pelo Zod
//         dueDate: data.dueDate, // validado pelo Zod
//         lesson: {
//           connect: { id: Number(data.lessonId) },
//         },
//       },
//     });

//     revalidatePath("/list/assignments");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log("ERRO NO CREATE:", err);
//     return { success: false, error: true };
//   }
// };

// // 🟦 Atualizar assignment
// export const updateAssignment = async (
//   currentState: CurrentState,
//   data: AssignmentSchema
// ) => {
//   const { userId, sessionClaims } = auth();
//   const role = (sessionClaims?.metadata as { role?: string })?.role;

//   try {
//     // Se professor, garantir que ele é dono da aula
//     if (role === "teacher") {
//       const lesson = await prisma.lesson.findUnique({
//         where: { id: Number(data.lessonId) },
//       });

//       if (!lesson || lesson.teacherId !== userId) {
//         return { success: false, error: true };
//       }
//     }

//     await prisma.assignment.update({
//       where: { id: Number(data.id) },
//       data: {
//         title: data.title,
//         startDate: data.startDate,
//         dueDate: data.dueDate,
//         lesson: {
//           connect: { id: Number(data.lessonId) },
//         },
//       },
//     });

//     revalidatePath("/list/assignments");
//     return { success: true, error: false };
//   } catch (err) {
//     console.log("ERRO NO UPDATE:", err);
//     return { success: false, error: true };
//   }
// };
// // 🟥 Deletar assignment
// export const deleteAssignment = async (
//   currentState: CurrentState,
//   formData: FormData
// ) => {
//   const id = Number(formData.get("id"));

//   try {
//     await prisma.assignment.delete({
//       where: { id },
//     });

//     return { success: true, error: false };
//   } catch (err) {
//     console.error(err);
//     return { success: false, error: true };
//   }
// };

// // 🟩 Criar novo resultado
// export const createResult = async (
//   currentState: CurrentState,
//   data: ResultSchema
// ) => {
//   try {
//     await prisma.result.create({
//       data: {
//         score: Number(data.score),
//         student: {
//           connect: { id: data.studentId },
//         },
//         ...(data.examId && {
//           exam: { connect: { id: Number(data.examId) } },
//         }),
//         ...(data.assignmentId && {
//           assignment: { connect: { id: Number(data.assignmentId) } },
//         }),
//       },
//     });

//     revalidatePath("/list/results");
//     return { success: true, error: false };
//   } catch (err) {
//     console.error("❌ Erro ao criar resultado:", err);
//     return { success: false, error: true };
//   }
// };

// // 🟦 Atualizar resultado
// export const updateResult = async (
//   currentState: CurrentState,
//   data: ResultSchema
// ) => {
//   try {
//     if (!data.id) {
//       throw new Error("ID é obrigatório para atualizar o resultado");
//     }

//     await prisma.result.update({
//       where: { id: data.id },
//       data: {
//         score: Number(data.score),

//         // limpar e definir novamente examId / assignmentId
//         examId: data.examId ? Number(data.examId) : null,
//         assignmentId: data.assignmentId ? Number(data.assignmentId) : null,

//         studentId: data.studentId,
//       },
//     });

//     revalidatePath("/list/results");
//     return { success: true, error: false };
//   } catch (err) {
//     console.error("❌ Erro ao atualizar resultado:", err);
//     return { success: false, error: true };
//   }
// };

// // 🟥 Deletar resultado
// export const deleteResult = async (
//   currentState: CurrentState,
//   data: FormData
// ) => {
//   const id = Number(data.get("id"));

//   try {
//     await prisma.result.delete({
//       where: { id },
//     });

//     return { success: true, error: false };
//   } catch (err) {
//     console.error("❌ Erro ao deletar resultado:", err);
//     return { success: false, error: true };
//   }
// };

// // 🟩 Criar novo evento
// export const createEvent = async (
//   currentState: { success: boolean; error: boolean },
//   data: EventSchema
// ) => {
//   try {
//     await prisma.event.create({
//       data: {
//         title: data.title,
//         description: data.description,
//         startTime: data.startTime,
//         endTime: data.endTime,
//         classId: data.classId ? Number(data.classId) : null,
//       },
//     });

//     // revalidatePath("/list/events");
//     return { success: true, error: false };
//   } catch (err) {
//     console.error("❌ Erro ao criar evento:", err);
//     return { success: false, error: true };
//   }
// };
// // 🟦 Atualizar evento
// export const updateEvent = async (
//   currentState: { success: boolean; error: boolean },
//   data: EventSchema
// ) => {
//   try {
//     await prisma.event.update({
//       where: { id: data.id },
//       data: {
//         title: data.title,
//         description: data.description,
//         startTime: data.startTime,
//         endTime: data.endTime,
//         classId: data.classId ? Number(data.classId) : null,
//       },
//     });

//     return { success: true, error: false };
//   } catch (err) {
//     console.error("❌ Erro ao atualizar evento:", err);
//     return { success: false, error: true };
//   }
// };

// // 🟥 Deletar evento
// export const deleteEvent = async (
//   currentState: { success: boolean; error: boolean },
//   formData: FormData
// ) => {
//   const id = Number(formData.get("id"));

//   try {
//     await prisma.event.delete({
//       where: { id },
//     });

//     return { success: true, error: false };
//   } catch (err) {
//     console.error("❌ Erro ao deletar evento:", err);
//     return { success: false, error: true };
//   }
// };

// // CREATE ATTENDANCE (server action compatível com useFormState)
// export const createAttendance = async (
//   currentState: { success: boolean; error: boolean },
//   data: AttendanceSchema
// ) => {
//   try {
//     const attendanceDate = data.date ? new Date(data.date) : new Date();

//     const startOfDay = new Date(attendanceDate);
//     startOfDay.setHours(0, 0, 0, 0);
//     const endOfDay = new Date(attendanceDate);
//     endOfDay.setHours(23, 59, 59, 999);

//     // remove registros do mesmo dia + mesma aula (se desejar sobrescrever)
//     await prisma.attendance.deleteMany({
//       where: {
//         lessonId: Number(data.lessonId),
//         date: { gte: startOfDay, lte: endOfDay },
//       },
//     });

//     // cria todos os registros de uma vez
//     await prisma.attendance.createMany({
//       data: data.records.map((rec) => ({
//         studentId: rec.studentId,
//         lessonId: Number(data.lessonId),
//         status: rec.status,
//         date: attendanceDate,
//       })),
//     });

//     revalidatePath("/list/attendance");
//     return { success: true, error: false };
//   } catch (err) {
//     console.error("❌ Erro ao criar presenças:", err);
//     return { success: false, error: true };
//   }
// };

// // UPDATE ATTENDANCE (atualiza um registro por id)
// export const updateAttendance = async (
//   currentState: { success: boolean; error: boolean },
//   data: {
//     id: number;
//     status?: any;
//     date?: Date | string;
//     lessonId?: number;
//     studentId?: string;
//   }
// ) => {
//   try {
//     const updatePayload: any = {};

//     if (data.status) updatePayload.status = data.status;
//     if (data.date) updatePayload.date = new Date(String(data.date));
//     if (data.lessonId) updatePayload.lessonId = Number(data.lessonId);
//     if (data.studentId) updatePayload.studentId = data.studentId;

//     await prisma.attendance.update({
//       where: { id: Number(data.id) },
//       data: updatePayload,
//     });

//     revalidatePath("/list/attendance");
//     return { success: true, error: false };
//   } catch (err) {
//     console.error("❌ Erro ao atualizar presença:", err);
//     return { success: false, error: true };
//   }
// };

// export const getAttendanceByLessonAndDate = async (
//   lessonId: number,
//   date: string
// ) => {
//   try {
//     const start = new Date(date + "T00:00:00");
//     const end = new Date(date + "T23:59:59");

//     return await prisma.attendance.findMany({
//       where: {
//         lessonId,
//         date: { gte: start, lte: end },
//       },
//       include: {
//         student: true,
//       },
//     });
//   } catch (err) {
//     console.error("❌ Erro ao buscar presenças:", err);
//     return [];
//   }
// };
// // DELETE ATTENDANCE
// export const deleteAttendance = async (
//   currentState: { success: boolean; error: boolean },
//   data: FormData
// ) => {
//   try {
//     const id = Number(data.get("id"));

//     if (!id || isNaN(id)) {
//       throw new Error("ID inválido para exclusão de presença");
//     }

//     await prisma.attendance.delete({
//       where: { id },
//     });

//     return { success: true, error: false };
//   } catch (error) {
//     console.error("❌ Erro ao deletar presença:", error);
//     return { success: false, error: true };
//   }
// };

// // 🟩 Criar novo anúncio
// export const createAnnouncement = async (data: AnnouncementSchema) => {
//   try {
//     await prisma.announcement.create({
//       data: {
//         title: data.title,
//         description: data.description,
//         date: data.date,
//         classId: data.classId || null,
//       },
//     });

//     revalidatePath("/list/announcements");
//   } catch (err) {
//     console.error(err);
//     throw new Error("Failed to create announcement!");
//   }
// };
// // 🟦 Atualizar anúncio
// export const updateAnnouncement = async (data: AnnouncementSchema) => {
//   try {
//     await prisma.announcement.update({
//       where: { id: data.id },
//       data: {
//         title: data.title,
//         description: data.description,
//         date: data.date,
//         classId: data.classId || null,
//       },
//     });

//     revalidatePath("/list/announcements");
//   } catch (err) {
//     console.error(err);
//     throw new Error("Failed to update announcement!");
//   }
// };
// // 🟥 Deletar anúncio
// export const deleteAnnouncement = async (id: number) => {
//   try {
//     await prisma.announcement.delete({
//       where: { id },
//     });

//     revalidatePath("/list/announcements");
//   } catch (err) {
//     console.error(err);
//     throw new Error("Failed to delete announcement!");
//   }
// };
