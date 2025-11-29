import { z } from "zod";

export const subjectSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: " O nome da disciplina é obrigatório!" }),
  teachers: z.array(z.string()), //teacher ids
});

export type SubjectSchema = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "O nome da turma é obrigatório!" }),
  capacity: z.coerce.number().min(1, { message: "A capacidade é obrigatória!" }),
  gradeId: z.coerce.number().min(1, { message: "O grau é obrigatório!" }),
  supervisorId: z.coerce.string().optional(),
});

export type ClassSchema = z.infer<typeof classSchema>;

export const teacherSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "O nome de usuário deve ter pelo menos 3 caracteres!" })
    .max(20, { message: "O nome de usuário deve ter no máximo 20 caracteres!" }),
  password: z
    .string()
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "O primeiro nome é obrigatório!" }),
  surname: z.string().min(1, { message: "O sobrenome é obrigatório!" }),
  email: z
    .string()
    .email({ message: "Endereço de e-mail inválido!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  description: z.string().optional(),
  img: z.string().optional(),
  bloodType: z.string().min(1, { message: "O tipo sanguíneo é obrigatório!" }),
  birthday: z.coerce.date({ message: "A data de nascimento é obrigatória!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "O sexo é obrigatório!" }),
  subjects: z.array(z.string()).optional(), // subject ids
});

export type TeacherSchema = z.infer<typeof teacherSchema>;

export const studentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "O nome de usuário deve ter pelo menos 3 caracteres!" })
    .max(20, { message: "O nome de usuário deve ter no máximo 20 caracteres!" }),
  password: z
    .string()
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "O primeiro nome é obrigatório!" }),
  surname: z.string().min(1, { message: "O sobrenome é obrigatório!" }),
  email: z
    .string()
    .email({ message: "Endereço de e-mail inválido!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  description: z.string().optional(),
  img: z.string().optional(),
  bloodType: z.string().min(1, { message: "O tipo sanguíneo é obrigatório!" }),
  birthday: z.coerce.date({ message: "A data de nascimento é obrigatória!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "O sexo é obrigatório!" }),
  gradeId: z.coerce.number().min(1, { message: "O grau é obrigatório!" }),
  classId: z.coerce.number().min(1, { message: "A turma é obrigatória!" }),
  parentId: z.string().min(1, { message: "O ID do responsável é obrigatório!" }),
});

export type StudentSchema = z.infer<typeof studentSchema>;

export const parentSchema = z.object({
  id: z.string().optional(),
  username: z.string().min(1, "O nome de usuário é obrigatório"),
  name: z.string().min(1, "O nome é obrigatório"),
  surname: z.string().min(1, "O sobrenome é obrigatório"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  password: z.string().optional(),
  phone: z.string().min(1, "O telefone é obrigatório"),
  address: z.string().min(1, "O endereço é obrigatório"),
  student: z.array(z.string()).optional(), // student ids
  img: z.string().optional(),
});
export type ParentSchema = z.infer<typeof parentSchema>;

export const examSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "O título é obrigatório!" }),
  startTime: z.coerce.date({ message: "A hora de início é obrigatória!" }),
  endTime: z.coerce.date({ message: "A hora de término é obrigatória!" }),
  lessonId: z.coerce.number({ message: "A aula é obrigatória!" }),
});

export type ExamSchema = z.infer<typeof examSchema>;

//  export const lessonSchema = z.object({
//   id: z.coerce.number().optional(),
//   name: z.string().min(1, { message: "O nome da aula é obrigatório!" }),
//   subjectId: z.coerce.number().min(1, { message: "A disciplina é obrigatória!" }),
//   teacherId: z.string().min(1, { message: "O professor é obrigatório!" }),
//   gradeId: z.coerce.number().min(1, { message: "O grau é obrigatório!" }),
// });

// export type LessonSchema = z.infer<typeof lessonSchema>;
  

export const lessonSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, "O nome é obrigatório"),
  subjectId: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => val > 0, "Selecione uma disciplina"),
  teacherId: z.string().min(1, "Selecione um professor"),
  gradeId: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => val > 0, "Selecione uma série"),
  classId: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => val > 0, "Selecione uma turma"),
  day: z.string().min(1, "Informe o dia da semana"),
  startTime: z.string().min(1, "Informe o horário de início"),
  endTime: z.string().min(1, "Informe o horário de término"),
});

export type LessonSchema = z.infer<typeof lessonSchema>;


export const gradeSchema = z.object({
  id: z.coerce.number().optional(),
  level: z.coerce.number(),
  description: z.string().min(1, { message: "A descrição é obrigatória!" }),
});

export type GradeSchema = z.infer<typeof gradeSchema>;



export const assignmentSchema = z.object({
id: z.number().optional(),
title: z.string().min(1, "O título é obrigatório"),
description: z.string().optional(),
startDate: z.coerce.date(),
dueDate: z.coerce.date(),
lessonId: z.coerce.number().optional(),

// lessonId: z.number()
});


export type AssignmentSchema = z.infer<typeof assignmentSchema>;

