// src/app/api/teacher/video-lessons/[id]/publish/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireUserId } from "@/lib/auth";
import { requireTeacher } from "@/lib/auth/require-teacher";

export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const teacher = await requireTeacher();

  const lesson = await prisma.videoLesson.findUnique({
    where: { id: params.id },
  });

  if (!lesson || lesson.teacherId !== teacher.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const updated = await prisma.videoLesson.update({
    where: { id: params.id },
    data: { published: true },
  });

  return NextResponse.json(updated);
}


export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // const userId = await requireUserId();
    const teacher = await requireTeacher();

    const lesson = await prisma.videoLesson.findUnique({
      where: { id: params.id },
    });

    if (!lesson || lesson.teacherId !== teacher.id) {
      return NextResponse.json(
        { error: "Aula não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(lesson);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar aula" },
      { status: 500 }
    );
  }
}
