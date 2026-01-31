import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();

    if (!user || user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // 🔥 BLINDAGEM ABSOLUTA
    const rawBody = await req.text();

    if (!rawBody || rawBody.trim() === "") {
      return NextResponse.json(
        { error: "Body vazio ou inválido" },
        { status: 400 }
      );
    }

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (err) {
      console.error("❌ JSON inválido recebido:", rawBody);
      return NextResponse.json(
        { error: "JSON inválido" },
        { status: 400 }
      );
    }

    const {
      title,
      description,
      videoUrl,
      publicId,
      duration,
      classId,
      subjectId,
    } = body;

    if (!title || !videoUrl || !publicId || !classId || !subjectId) {
      return NextResponse.json(
        { error: "Dados obrigatórios ausentes" },
        { status: 400 }
      );
    }

    const videoLesson = await prisma.videoLesson.create({
      data: {
        title,
        description,
        videoUrl,
        publicId,
        duration,

        teacher: {
          connect: { id: user.id },
        },

        class: {
          connect: { id: Number(classId) },
        },

        subject: {
          connect: { id: Number(subjectId) },
        },
      },
    });

    return NextResponse.json(videoLesson);
  } catch (error) {
    console.error("🔥 ERRO AO CRIAR VIDEO LESSON:", error);
    return NextResponse.json(
      { error: "Erro ao criar video lesson" },
      { status: 500 }
    );
  }
}



// // src/app/api/teacher/video-lessons/route.ts
// import { NextResponse } from "next/server";
// import { getAuthUser } from "@/lib/auth";
// import prisma from "@/lib/prisma";

// export async function POST(req: Request) {
//   try {
//     const user = await getAuthUser();

//     if (!user || user.role !== "teacher") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
//     }

//     const body = await req.json();
//     const {
//       title,
//       description,
//       classId,
//       subjectId,
//       videoUrl,
//       publicId,
//       duration,
//     } = body;

//     if (!title || !classId || !subjectId || !videoUrl) {
//       return NextResponse.json(
//         { error: "Dados obrigatórios ausentes" },
//         { status: 400 }
//       );
//     }

//     const videoLesson = await prisma.videoLesson.create({
//       data: {
//         title,
//         description,
//         videoUrl,
//         publicId,
//         duration,
//         classId: Number(classId),
//         subjectId: Number(subjectId),
//         teacherId: user.id,
//       },
//     });

//     return NextResponse.json(videoLesson, { status: 201 });
//   } catch (error) {
//     console.error("Erro ao criar video lesson:", error);
//     return NextResponse.json(
//       { error: "Erro ao criar video lesson" },
//       { status: 500 }
//     );
//   }
// }
